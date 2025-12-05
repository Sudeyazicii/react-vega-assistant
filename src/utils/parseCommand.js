import { generateSpec } from './generateSpec';

export const parseCommand = (command, analysis, data) => {
    const lowerCmd = command.toLowerCase();
    const cols = analysis.columnNames;

    // Helper to find closest column match
    const findCol = (text) => {
        // Simple exact or partial match
        // In a real app, use Levenshtein distance
        const exact = cols.find(c => text.includes(c.toLowerCase()));
        if (exact) return exact;

        // Split command into words and check if any word matches a column start
        const words = text.split(/\s+/);
        for (const word of words) {
            const match = cols.find(c => c.toLowerCase().startsWith(word));
            if (match) return match;
        }
        return null;
    };

    // Detect Chart Type
    let mark = 'bar';
    if (lowerCmd.includes('line') || lowerCmd.includes('çizgi')) mark = 'line';
    else if (lowerCmd.includes('scatter') || lowerCmd.includes('dağılım') || lowerCmd.includes('nokta')) mark = 'circle';
    else if (lowerCmd.includes('area') || lowerCmd.includes('alan')) mark = 'area';
    else if (lowerCmd.includes('pie') || lowerCmd.includes('donut') || lowerCmd.includes('halka') || lowerCmd.includes('pasta')) mark = 'arc';
    else if (lowerCmd.includes('hist')) mark = 'bar'; // Histogram is a bar with binning

    // Detect Fields
    // Strategy: Look for "x ...", "y ...", "color ...", "size ..." patterns
    // Or just find mentioned columns and assign them heuristically

    const mentionedCols = cols.filter(c => lowerCmd.includes(c.toLowerCase()));

    let x = null, y = null, color = null, size = null;

    // Try to parse explicit assignments first: "x=Date", "y ekseni Sales"
    // Regex for "x ...", "y ..."
    // This is hard with simple regex for free text, so we'll rely on mentioned columns + types

    if (mentionedCols.length > 0) {
        // Assign based on types
        const quant = mentionedCols.filter(c => analysis.columns[c].type === 'quantitative');
        const temporal = mentionedCols.filter(c => analysis.columns[c].type === 'temporal');
        const nominal = mentionedCols.filter(c => analysis.columns[c].type === 'nominal');

        if (mark === 'line') {
            x = temporal[0] || nominal[0] || mentionedCols[0];
            y = quant[0] || mentionedCols[1];
            color = nominal.find(c => c !== x);
        } else if (mark === 'bar') {
            x = nominal[0] || temporal[0] || mentionedCols[0];
            y = quant[0] || mentionedCols[1];
            color = nominal.find(c => c !== x);
        } else if (mark === 'circle') {
            x = quant[0] || mentionedCols[0];
            y = quant[1] || mentionedCols[1];
            color = nominal[0];
            size = quant[2];
        } else if (mark === 'arc') {
            color = nominal[0] || mentionedCols[0];
            x = quant[0] || mentionedCols[1]; // Theta
        }
    }

    // Fallback if no columns found or assignment failed
    if (!x && !y && mentionedCols.length === 0) {
        return null; // Could not parse
    }

    // Construct Encoding
    const encoding = {};
    if (x) encoding.x = { field: x, type: analysis.columns[x].type };
    if (y) encoding.y = { field: y, type: analysis.columns[y].type };
    if (color) encoding.color = { field: color, type: analysis.columns[color].type };
    if (size) encoding.size = { field: size, type: 'quantitative' };

    // Special case for Pie/Donut
    if (mark === 'arc') {
        encoding.theta = { field: x || y, aggregate: 'sum' }; // Use the numeric field for theta
        encoding.color = { field: color || (x === encoding.theta.field ? y : x), type: 'nominal' };
        delete encoding.x;
        delete encoding.y;
    }

    // Special case for Histogram
    if (lowerCmd.includes('hist') && x) {
        encoding.x = { field: x, bin: true };
        encoding.y = { aggregate: 'count' };
    }

    return generateSpec(mark, encoding, data);
};
