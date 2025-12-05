import * as XLSX from 'xlsx';

export const analyzeDataset = (data) => {
    if (!data || data.length === 0) return null;

    const columns = Object.keys(data[0]);
    const analysis = {
        columns: {},
        rowCount: data.length,
        columnNames: columns
    };

    columns.forEach(col => {
        const values = data.map(row => row[col]).filter(v => v !== undefined && v !== null && v !== '');
        const missingCount = data.length - values.length;
        const missingPercent = missingCount / data.length;

        // Type Detection
        let type = 'nominal';
        const sample = values.slice(0, 100); // Check first 100 non-null values

        const isNumeric = sample.every(v => !isNaN(parseFloat(v)) && isFinite(v));
        const isDate = sample.every(v => !isNaN(Date.parse(v)) || v instanceof Date);

        // Heuristic for categorical vs text: low cardinality
        const uniqueValues = new Set(values);
        const uniqueCount = uniqueValues.size;
        const isLowCardinality = uniqueCount < 50 || uniqueCount < data.length * 0.2;

        if (isNumeric) {
            type = 'quantitative';
        } else if (isDate) {
            type = 'temporal';
        } else if (isLowCardinality) {
            type = 'nominal'; // Categorical
        } else {
            type = 'nominal'; // Default to nominal for text, but could be 'ordinal' if sorted
        }

        // Statistics
        let stats = {};
        if (type === 'quantitative') {
            const nums = values.map(v => parseFloat(v));
            const sum = nums.reduce((a, b) => a + b, 0);
            const mean = sum / nums.length;
            const min = Math.min(...nums);
            const max = Math.max(...nums);
            // Median
            nums.sort((a, b) => a - b);
            const mid = Math.floor(nums.length / 2);
            const median = nums.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;

            stats = { mean, median, min, max };
        } else {
            // Top frequent values
            const counts = {};
            values.forEach(v => counts[v] = (counts[v] || 0) + 1);
            const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 3);
            stats = { topValues: sorted.map(s => s[0]) };
        }

        analysis.columns[col] = {
            type,
            missingPercent,
            uniqueCount,
            stats
        };
    });

    return analysis;
};
