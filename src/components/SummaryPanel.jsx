import React from 'react';
import { FileText, BarChart2, Hash, Calendar, Type } from 'lucide-react';

const SummaryPanel = ({ analysis }) => {
    if (!analysis) return (
        <div className="p-6 text-center text-gray-400 flex flex-col items-center justify-center h-full">
            <FileText className="w-12 h-12 mb-4 opacity-20" />
            <p>Lütfen analiz için bir dosya yükleyin.</p>
        </div>
    );

    const getTypeIcon = (type) => {
        switch (type) {
            case 'quantitative': return <Hash className="w-3 h-3" />;
            case 'temporal': return <Calendar className="w-3 h-3" />;
            default: return <Type className="w-3 h-3" />;
        }
    };

    return (
        <div className="h-full overflow-y-auto p-6 space-y-8">
            <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
                    <FileText className="w-5 h-5 text-blue-500" />
                    Veri Seti Analizi
                </h2>

                <div className="space-y-3">
                    {analysis.columnNames.map((col) => {
                        const colData = analysis.columns[col];
                        return (
                            <div key={col} className="group flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${colData.type === 'quantitative' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' :
                                            colData.type === 'temporal' ? 'bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400' :
                                                'bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
                                        }`}>
                                        {getTypeIcon(colData.type)}
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-700 dark:text-gray-200">{col}</div>
                                        <div className="text-xs text-gray-400 capitalize">{colData.type}</div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="text-xs text-gray-400 mb-1">Eksik</div>
                                    <div className={`text-xs font-mono font-medium ${colData.missingPercent > 0 ? 'text-amber-500' : 'text-gray-300 dark:text-gray-600'
                                        }`}>
                                        {(colData.missingPercent * 100).toFixed(0)}%
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
                    <BarChart2 className="w-5 h-5 text-emerald-500" />
                    Hızlı İstatistikler
                </h2>
                <div className="grid gap-4">
                    {analysis.columnNames.filter(c => analysis.columns[c].type === 'quantitative').map((col) => {
                        const stats = analysis.columns[col].stats;
                        return (
                            <div key={col} className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                <div className="font-medium text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                    {col}
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white dark:bg-gray-900/50 p-2 rounded-lg border border-gray-100 dark:border-gray-700">
                                        <div className="text-[10px] text-gray-400 uppercase tracking-wider">Ortalama</div>
                                        <div className="font-mono text-sm text-gray-700 dark:text-gray-200">{stats.mean?.toLocaleString(undefined, { maximumFractionDigits: 1 })}</div>
                                    </div>
                                    <div className="bg-white dark:bg-gray-900/50 p-2 rounded-lg border border-gray-100 dark:border-gray-700">
                                        <div className="text-[10px] text-gray-400 uppercase tracking-wider">Medyan</div>
                                        <div className="font-mono text-sm text-gray-700 dark:text-gray-200">{stats.median?.toLocaleString(undefined, { maximumFractionDigits: 1 })}</div>
                                    </div>
                                    <div className="bg-white dark:bg-gray-900/50 p-2 rounded-lg border border-gray-100 dark:border-gray-700">
                                        <div className="text-[10px] text-gray-400 uppercase tracking-wider">Min</div>
                                        <div className="font-mono text-sm text-gray-700 dark:text-gray-200">{stats.min?.toLocaleString()}</div>
                                    </div>
                                    <div className="bg-white dark:bg-gray-900/50 p-2 rounded-lg border border-gray-100 dark:border-gray-700">
                                        <div className="text-[10px] text-gray-400 uppercase tracking-wider">Max</div>
                                        <div className="font-mono text-sm text-gray-700 dark:text-gray-200">{stats.max?.toLocaleString()}</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default SummaryPanel;
