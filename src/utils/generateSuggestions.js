import { generateSpec } from './generateSpec';

export const generateSuggestions = (analysis, data) => {
    const suggestions = [];
    const cols = analysis.columns;
    const colNames = analysis.columnNames;

    // Helper to find columns by type
    const getCols = (type) => colNames.filter(c => cols[c].type === type);

    const quantCols = getCols('quantitative');
    const temporalCols = getCols('temporal');
    const nominalCols = getCols('nominal');

    let rank = 1;

    // 1. Line Chart (Temporal + Quantitative)
    if (temporalCols.length > 0 && quantCols.length > 0) {
        suggestions.push({
            rank: rank++,
            chart_type: "Line Chart",
            reason: `Shows trends of ${quantCols[0]} over time (${temporalCols[0]}).`,
            mapping: { x: temporalCols[0], y: quantCols[0], color: nominalCols[0] || null },
            spec: generateSpec('line', {
                x: { field: temporalCols[0], type: 'temporal' },
                y: { field: quantCols[0], type: 'quantitative' },
                color: nominalCols.length > 0 ? { field: nominalCols[0], type: 'nominal' } : undefined
            }, data)
        });
    }

    // 2. Bar Chart (Nominal + Quantitative)
    if (nominalCols.length > 0 && quantCols.length > 0) {
        suggestions.push({
            rank: rank++,
            chart_type: "Bar Chart",
            reason: `Compares ${quantCols[0]} across different ${nominalCols[0]} categories.`,
            mapping: { x: nominalCols[0], y: quantCols[0] },
            spec: generateSpec('bar', {
                x: { field: nominalCols[0], type: 'nominal', sort: '-y' },
                y: { field: quantCols[0], type: 'quantitative', aggregate: 'sum' },
                color: { field: nominalCols[0], type: 'nominal' } // Auto color for aesthetics
            }, data)
        });
    }

    // 3. Scatter Plot (Quantitative + Quantitative)
    if (quantCols.length >= 2) {
        suggestions.push({
            rank: rank++,
            chart_type: "Scatter Plot",
            reason: `Shows relationship between ${quantCols[0]} and ${quantCols[1]}.`,
            mapping: { x: quantCols[0], y: quantCols[1], color: nominalCols[0] || null },
            spec: generateSpec('circle', {
                x: { field: quantCols[0], type: 'quantitative' },
                y: { field: quantCols[1], type: 'quantitative' },
                color: nominalCols.length > 0 ? { field: nominalCols[0], type: 'nominal' } : undefined,
                size: quantCols[2] ? { field: quantCols[2], type: 'quantitative' } : undefined
            }, data)
        });
    }

    // 4. Histogram (Quantitative Distribution)
    if (quantCols.length > 0) {
        suggestions.push({
            rank: rank++,
            chart_type: "Histogram",
            reason: `Shows distribution of ${quantCols[0]}.`,
            mapping: { x: quantCols[0] },
            spec: generateSpec('bar', {
                x: { field: quantCols[0], bin: true },
                y: { aggregate: 'count' }
            }, data)
        });
    }

    // 5. Box Plot (Nominal + Quantitative)
    if (nominalCols.length > 0 && quantCols.length > 0) {
        suggestions.push({
            rank: rank++,
            chart_type: "Box Plot",
            reason: `Shows distribution and outliers of ${quantCols[0]} for each ${nominalCols[0]}.`,
            mapping: { x: nominalCols[0], y: quantCols[0] },
            spec: generateSpec('boxplot', {
                x: { field: nominalCols[0], type: 'nominal' },
                y: { field: quantCols[0], type: 'quantitative' }
            }, data)
        });
    }

    // 6. Heatmap (Temporal/Nominal + Nominal + Quantitative)
    if (nominalCols.length >= 2 && quantCols.length > 0) {
        suggestions.push({
            rank: rank++,
            chart_type: "Heatmap",
            reason: `Shows intensity of ${quantCols[0]} between ${nominalCols[0]} and ${nominalCols[1]}.`,
            mapping: { x: nominalCols[0], y: nominalCols[1], color: quantCols[0] },
            spec: generateSpec('rect', {
                x: { field: nominalCols[0], type: 'nominal' },
                y: { field: nominalCols[1], type: 'nominal' },
                color: { field: quantCols[0], aggregate: 'sum' }
            }, data)
        });
    } else if (temporalCols.length > 0 && nominalCols.length > 0 && quantCols.length > 0) {
        suggestions.push({
            rank: rank++,
            chart_type: "Heatmap",
            reason: `Shows intensity of ${quantCols[0]} over time by ${nominalCols[0]}.`,
            mapping: { x: temporalCols[0], y: nominalCols[0], color: quantCols[0] },
            spec: generateSpec('rect', {
                x: { field: temporalCols[0], timeUnit: 'month', type: 'ordinal' },
                y: { field: nominalCols[0], type: 'nominal' },
                color: { field: quantCols[0], aggregate: 'sum' }
            }, data)
        });
    }

    // 7. Donut Chart (Nominal + Quantitative)
    if (nominalCols.length > 0 && quantCols.length > 0) {
        suggestions.push({
            rank: rank++,
            chart_type: "Donut Chart",
            reason: `Shows proportion of ${quantCols[0]} by ${nominalCols[0]}.`,
            mapping: { color: nominalCols[0], theta: quantCols[0] },
            spec: generateSpec('arc', {
                theta: { field: quantCols[0], aggregate: 'sum' },
                color: { field: nominalCols[0], type: 'nominal' }
            }, data, { markOptions: { innerRadius: 50 } })
        });
    }

    // 8. Area Chart (Temporal + Quantitative)
    if (temporalCols.length > 0 && quantCols.length > 0) {
        suggestions.push({
            rank: rank++,
            chart_type: "Area Chart",
            reason: `Shows cumulative trend of ${quantCols[0]} over time.`,
            mapping: { x: temporalCols[0], y: quantCols[0], color: nominalCols[0] || null },
            spec: generateSpec('area', {
                x: { field: temporalCols[0], type: 'temporal' },
                y: { field: quantCols[0], type: 'quantitative', stack: 'center' },
                color: nominalCols.length > 0 ? { field: nominalCols[0], type: 'nominal' } : undefined
            }, data)
        });
    }

    // 9. Grouped Bar Chart (Nominal + Nominal + Quantitative)
    if (nominalCols.length >= 2 && quantCols.length > 0) {
        suggestions.push({
            rank: rank++,
            chart_type: "Grouped Bar",
            reason: `Compares ${quantCols[0]} by ${nominalCols[0]} grouped by ${nominalCols[1]}.`,
            mapping: { x: nominalCols[0], y: quantCols[0], color: nominalCols[1] },
            spec: generateSpec('bar', {
                x: { field: nominalCols[0], type: 'nominal' },
                y: { field: quantCols[0], type: 'quantitative', aggregate: 'sum' },
                xOffset: { field: nominalCols[1] },
                color: { field: nominalCols[1], type: 'nominal' }
            }, data)
        });
    }

    // 10. Bubble Chart (3 Quantitative)
    if (quantCols.length >= 3) {
        suggestions.push({
            rank: rank++,
            chart_type: "Bubble Chart",
            reason: `Multi-variable comparison: ${quantCols[0]} vs ${quantCols[1]} sized by ${quantCols[2]}.`,
            mapping: { x: quantCols[0], y: quantCols[1], size: quantCols[2], color: nominalCols[0] || null },
            spec: generateSpec('circle', {
                x: { field: quantCols[0], type: 'quantitative' },
                y: { field: quantCols[1], type: 'quantitative' },
                size: { field: quantCols[2], type: 'quantitative' },
                color: nominalCols.length > 0 ? { field: nominalCols[0], type: 'nominal' } : undefined
            }, data)
        });
    }

    // Fill up to 10 if needed (fallback to simple bars of other columns)
    while (suggestions.length < 10 && nominalCols.length > 0 && quantCols.length > 0) {
        // Just pick random combinations or different aggregations
        // For simplicity, we stop here as we covered most standard types.
        // Or we could add a simple count bar chart for categorical
        const cat = nominalCols[suggestions.length % nominalCols.length];
        suggestions.push({
            rank: rank++,
            chart_type: "Count Bar",
            reason: `Frequency of ${cat}.`,
            mapping: { x: cat, y: "Count" },
            spec: generateSpec('bar', {
                x: { field: cat, type: 'nominal', sort: '-y' },
                y: { aggregate: 'count' }
            }, data)
        });
    }

    return suggestions.slice(0, 10);
};
