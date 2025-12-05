import { generateSpec } from './generateSpec';

export const checkCompatibility = (chartType, analysis, data) => {
    const cols = analysis.columnNames;
    const colData = analysis.columns;

    // Helper to find columns by type
    const getCols = (type) => cols.filter(c => colData[c].type === type);

    const quant = getCols('quantitative');
    const temporal = getCols('temporal');
    const nominal = getCols('nominal');

    let compatible = false;
    let reason = "";
    let spec = null;

    switch (chartType) {
        case 'line':
            if (temporal.length > 0 && quant.length > 0) {
                compatible = true;
                spec = generateSpec('line', {
                    x: { field: temporal[0], type: 'temporal' },
                    y: { field: quant[0], type: 'quantitative' },
                    color: nominal.length > 0 ? { field: nominal[0], type: 'nominal' } : undefined
                }, data);
            } else {
                reason = "Line chart requires at least one Date and one Numeric column.";
            }
            break;

        case 'bar':
            if (nominal.length > 0 && quant.length > 0) {
                compatible = true;
                spec = generateSpec('bar', {
                    x: { field: nominal[0], type: 'nominal', sort: '-y' },
                    y: { field: quant[0], type: 'quantitative', aggregate: 'sum' },
                    color: { field: nominal[0], type: 'nominal' }
                }, data);
            } else {
                reason = "Bar chart requires at least one Categorical and one Numeric column.";
            }
            break;

        case 'circle': // Scatter
            if (quant.length >= 2) {
                compatible = true;
                spec = generateSpec('circle', {
                    x: { field: quant[0], type: 'quantitative' },
                    y: { field: quant[1], type: 'quantitative' },
                    color: nominal.length > 0 ? { field: nominal[0], type: 'nominal' } : undefined,
                    size: quant[2] ? { field: quant[2], type: 'quantitative' } : undefined
                }, data);
            } else {
                reason = "Scatter plot requires at least two Numeric columns.";
            }
            break;

        case 'arc': // Pie/Donut
            if (nominal.length > 0 && quant.length > 0) {
                compatible = true;
                spec = generateSpec('arc', {
                    theta: { field: quant[0], aggregate: 'sum' },
                    color: { field: nominal[0], type: 'nominal' }
                }, data, { markOptions: { innerRadius: 50 } });
            } else {
                reason = "Pie/Donut chart requires at least one Categorical and one Numeric column.";
            }
            break;

        case 'area':
            if (temporal.length > 0 && quant.length > 0) {
                compatible = true;
                spec = generateSpec('area', {
                    x: { field: temporal[0], type: 'temporal' },
                    y: { field: quant[0], type: 'quantitative', stack: 'center' },
                    color: nominal.length > 0 ? { field: nominal[0], type: 'nominal' } : undefined
                }, data);
            } else {
                reason = "Area chart requires at least one Date and one Numeric column.";
            }
            break;

        case 'rect': // Heatmap
            if (nominal.length >= 2 && quant.length > 0) {
                compatible = true;
                spec = generateSpec('rect', {
                    x: { field: nominal[0], type: 'nominal' },
                    y: { field: nominal[1], type: 'nominal' },
                    color: { field: quant[0], aggregate: 'sum' }
                }, data);
            } else {
                reason = "Heatmap requires at least two Categorical and one Numeric column.";
            }
            break;

        default:
            reason = "Unknown chart type.";
    }

    return { compatible, reason, spec };
};
