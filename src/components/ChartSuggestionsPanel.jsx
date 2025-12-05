import React from 'react';
import { AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';

const ChartSuggestionsPanel = ({ suggestions, onDrawChart }) => {
    if (!suggestions || suggestions.length === 0) return (
        <div className="p-6 text-center text-gray-400 flex flex-col items-center justify-center h-full">
            <Sparkles className="w-12 h-12 mb-4 opacity-20" />
            <p>Veri yüklendiğinde AI önerileri burada görünecek.</p>
        </div>
    );

    return (
        <div className="h-full overflow-y-auto p-6">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-800 dark:text-white sticky top-0 bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur py-2 z-10">
                <Sparkles className="w-5 h-5 text-purple-500" />
                AI Önerileri
            </h2>

            <div className="space-y-4">
                {suggestions.map((suggestion) => (
                    <div
                        key={suggestion.rank}
                        className="group relative bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all duration-300"
                    >
                        <div className="absolute top-4 right-4 text-6xl font-black text-gray-50 dark:text-gray-800/50 -z-0 select-none transition-colors group-hover:text-blue-50 dark:group-hover:text-blue-900/20">
                            {suggestion.rank}
                        </div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="font-bold text-lg text-gray-800 dark:text-white capitalize group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {suggestion.chart_type}
                                </h3>
                            </div>

                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                                {suggestion.reason}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {Object.entries(suggestion.mapping).map(([k, v]) => v && (
                                    <span key={k} className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-xs text-gray-600 dark:text-gray-300">
                                        <span className="opacity-50 mr-1">{k}:</span> {v}
                                    </span>
                                ))}
                            </div>

                            {suggestion.caveats && (
                                <div className="flex items-start gap-2 text-xs text-amber-600 dark:text-amber-400/80 mb-4 bg-amber-50 dark:bg-amber-900/10 p-2 rounded-lg">
                                    <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                                    <span>{suggestion.caveats}</span>
                                </div>
                            )}

                            <button
                                onClick={() => onDrawChart(suggestion)}
                                className="w-full py-2.5 px-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] hover:shadow-lg hover:bg-blue-600 dark:hover:bg-blue-400 dark:hover:text-white font-medium text-sm"
                            >
                                Grafiği Oluştur
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChartSuggestionsPanel;
