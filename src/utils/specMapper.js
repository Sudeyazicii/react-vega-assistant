/**
 * Maps a chart suggestion to a full Vega-Lite spec with data.
 * @param {Object} suggestion - The chart suggestion object from notebookOutput.json
 * @param {Array} data - The uploaded data array
 * @returns {Object} - The Vega-Lite spec
 */
export const mapSuggestionToSpec = (suggestion, data) => {
    const spec = {
        $schema: "https://vega.github.io/schema/vega-lite/v5.json",
        data: { values: data },
        width: "container",
        height: 300,
        ...suggestion.sample_spec
    };
    return spec;
};

/**
 * Parses a natural language command into a Vega-Lite spec.
 * Supported format: "chart_type x=Field y=Field color=Field size=Field"
 * Example: "line chart x=Date y=Sales color=Category"
 * @param {String} command - The user's command
 * @param {Array} data - The uploaded data array
 * @returns {Object} - The Vega-Lite spec
 */
export const parseNaturalLanguageCommand = (command, data) => {
    const lowerCommand = command.toLowerCase();

    // Detect chart type
    let mark = "bar"; // default
    if (lowerCommand.includes("line")) mark = "line";
    else if (lowerCommand.includes("scatter") || lowerCommand.includes("point")) mark = "circle";
    else if (lowerCommand.includes("area")) mark = "area";
    else if (lowerCommand.includes("rect") || lowerCommand.includes("heatmap")) mark = "rect";
    else if (lowerCommand.includes("arc") || lowerCommand.includes("donut") || lowerCommand.includes("pie")) mark = "arc";

    // Extract mappings using regex
    const extractField = (key) => {
        const regex = new RegExp(`${key}=([\\w_çğıöşüÇĞİÖŞÜ]+)`, "i");
        const match = command.match(regex);
        return match ? match[1] : null;
    };

    const x = extractField("x");
    const y = extractField("y");
    const color = extractField("color");
    const size = extractField("size");
    const theta = extractField("theta"); // for pie/donut

    const encoding = {};

    if (x) encoding.x = { field: x, type: detectType(x, data) };
    if (y) encoding.y = { field: y, type: detectType(y, data) };
    if (color) encoding.color = { field: color, type: detectType(color, data) };
    if (size) encoding.size = { field: size, type: "quantitative" };
    if (theta) encoding.theta = { field: theta, type: "quantitative" };

    // Special handling for pie/donut
    if (mark === "arc" && !theta && y) {
        encoding.theta = { field: y, type: "quantitative" };
        if (x) encoding.color = { field: x, type: "nominal" }; // usually x is category for pie
    }

    return {
        $schema: "https://vega.github.io/schema/vega-lite/v5.json",
        data: { values: data },
        width: "container",
        height: 300,
        mark: mark,
        encoding: encoding
    };
};

const detectType = (field, data) => {
    if (!data || data.length === 0) return "nominal";
    const value = data[0][field];
    if (typeof value === 'number') return "quantitative";
    if (value instanceof Date || (typeof value === 'string' && !isNaN(Date.parse(value)))) return "temporal";
    return "nominal";
};
