export const analyzeChartImage = (file) => {
    return new Promise((resolve) => {
        // Simulate processing delay
        setTimeout(() => {
            const name = file.name.toLowerCase();

            // Simple heuristic based on filename for demo purposes
            // In a real app, this would send the image to a backend or use TF.js
            if (name.includes('line')) resolve('line');
            else if (name.includes('bar')) resolve('bar');
            else if (name.includes('scatter') || name.includes('point')) resolve('circle');
            else if (name.includes('pie') || name.includes('donut')) resolve('arc');
            else if (name.includes('area')) resolve('area');
            else if (name.includes('heat')) resolve('rect');
            else {
                // Random fallback for demo if filename is generic
                const types = ['bar', 'line', 'circle', 'arc', 'area', 'rect'];
                resolve(types[Math.floor(Math.random() * types.length)]);
            }
        }, 1500);
    });
};
