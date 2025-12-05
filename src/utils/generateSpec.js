export const generateSpec = (mark, encoding, data, options = {}) => {
    const spec = {
        $schema: "https://vega.github.io/schema/vega-lite/v5.json",
        width: "container",
        height: 400,
        autosize: { type: "fit", contains: "padding" },
        data: { values: data }, // In a real app with large data, we might use a named data source or URL
        mark: { type: mark, tooltip: true, ...options.markOptions },
        encoding: { ...encoding },
        selection: {
            grid: {
                type: "interval", bind: "scales" // Zoom & Pan
            }
        },
        config: {
            view: { stroke: "transparent" },
            axis: {
                domain: false,
                tickColor: "lightgray",
                gridColor: "#f3f4f6", // gray-100
                labelColor: "#4b5563", // gray-600
                titleColor: "#374151", // gray-700
                titleFontWeight: "bold"
            },
            legend: {
                titleColor: "#374151",
                labelColor: "#4b5563"
            }
        }
    };

    // Add specific interactive features based on options
    if (options.interactive) {
        // Already added grid selection above
    }

    return spec;
};
