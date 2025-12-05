import React, { useEffect, useRef, useState } from 'react';
import embed from 'vega-embed';
import { Download, Code, Play, Command, Maximize2 } from 'lucide-react';

const ChartViewer = ({ spec, title, onCustomCommand }) => {
    const containerRef = useRef(null);
    const [command, setCommand] = useState("");
    const [view, setView] = useState(null);

    useEffect(() => {
        if (spec && containerRef.current) {
            // Force light theme for chart readability or adapt based on system
            // Vega-Lite themes can be tricky with dark mode, sticking to standard for clarity
            embed(containerRef.current, spec, {
                actions: false,
                theme: 'quartz', // or 'vox' or default
                renderer: 'svg'
            })
                .then((result) => {
                    setView(result.view);
                })
                .catch((err) => console.error(err));
        }
    }, [spec]);

    const handleExport = async (format) => {
        if (view) {
            const url = await view.toImageURL(format);
            const link = document.createElement('a');
            link.href = url;
            link.download = `chart.${format}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleCopySpec = () => {
        navigator.clipboard.writeText(JSON.stringify(spec, null, 2));
        // Could add a toast here
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (command.trim()) {
            onCustomCommand(command);
        }
    };

    return (
        <div className="h-full flex flex-col bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm">
            {/* Toolbar */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-white/50 dark:bg-gray-800/50 backdrop-blur">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
                    <h2 className="font-bold text-gray-800 dark:text-white tracking-tight">
                        {title || "Görselleştirme Alanı"}
                    </h2>
                </div>

                <div className="flex gap-2">
                    <button onClick={() => handleExport('png')} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors" title="Export PNG">
                        <Download className="w-5 h-5" />
                    </button>
                    <button onClick={handleCopySpec} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors" title="Copy JSON">
                        <Code className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Chart Area */}
            <div className="flex-1 p-8 overflow-hidden flex flex-col items-center justify-center relative">
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:16px_16px] opacity-50 pointer-events-none"></div>

                {spec ? (
                    <div className="w-full h-full max-w-4xl max-h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-6 flex items-center justify-center relative z-10 animate-in fade-in zoom-in duration-300">
                        <div ref={containerRef} className="w-full h-full flex items-center justify-center" />
                    </div>
                ) : (
                    <div className="text-center space-y-4 max-w-md relative z-10">
                        <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Maximize2 className="w-10 h-10 text-blue-500 dark:text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Henüz bir grafik seçilmedi</h3>
                        <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                            Sol panelden yapay zeka önerilerini inceleyin veya aşağıya kendi grafik komutunuzu yazın.
                        </p>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <Command className="w-5 h-5" />
                    </div>
                    <input
                        type="text"
                        value={command}
                        onChange={(e) => setCommand(e.target.value)}
                        placeholder="Yapay zekaya sor: 'Tarih ve Satış Miktarı için line chart çiz'..."
                        className="w-full pl-12 pr-32 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm text-gray-800 dark:text-white placeholder-gray-400"
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl flex items-center gap-2 font-medium transition-colors shadow-lg shadow-blue-500/30"
                    >
                        <Play className="w-4 h-4 fill-current" />
                        Oluştur
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChartViewer;
