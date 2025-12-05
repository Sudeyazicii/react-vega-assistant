import React, { useState, useEffect } from 'react';
import { Upload, Moon, Sun, LayoutDashboard, Image as ImageIcon, Loader2 } from 'lucide-react';
import SummaryPanel from './components/SummaryPanel';
import ChartSuggestionsPanel from './components/ChartSuggestionsPanel';
import ChartViewer from './components/ChartViewer';
import { parseFile } from './utils/fileParser';
import { analyzeDataset } from './utils/analyzeData';
import { generateSuggestions } from './utils/generateSuggestions';

import { parseCommand } from './utils/parseCommand';
import { analyzeChartImage } from './utils/imageAnalysis';
import { checkCompatibility } from './utils/compatibilityChecker';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [uploadedData, setUploadedData] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [activeSpec, setActiveSpec] = useState(null);
  const [activeTitle, setActiveTitle] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);

  // Initialize theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const data = await parseFile(file);
        setUploadedData(data);
        setFileName(file.name);

        // Dynamic Analysis
        const analysisResult = analyzeDataset(data);
        setAnalysis(analysisResult);

        // Generate Suggestions
        const newSuggestions = generateSuggestions(analysisResult, data);
        setSuggestions(newSuggestions);

        // Reset active spec
        setActiveSpec(null);
        setActiveTitle(null);
      } catch (error) {
        console.error("File parse error:", error);
        alert("Dosya yüklenirken hata oluştu!");
      }
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!analysis) {
      alert("Lütfen önce bir veri seti yükleyin!");
      return;
    }

    setIsAnalyzingImage(true);
    try {
      // 1. Analyze Image
      const detectedType = await analyzeChartImage(file);

      // 2. Check Compatibility
      const { compatible, reason, spec } = checkCompatibility(detectedType, analysis, uploadedData);

      if (compatible) {
        // Create a single suggestion for the detected type
        const matchedSuggestion = {
          rank: 1,
          chart_type: detectedType.charAt(0).toUpperCase() + detectedType.slice(1) + " Chart",
          reason: `Yüklediğiniz görselden tespit edilen grafik türü (${detectedType}) verinizle uyumlu.`,
          mapping: {}, // We could populate this if we had the mapping from checkCompatibility, but spec is enough
          spec: spec
        };

        // Update state to show ONLY this suggestion
        setSuggestions([matchedSuggestion]);
        setActiveSpec(spec);
        setActiveTitle(`Görselden Tespit Edilen: ${detectedType.toUpperCase()} Chart`);

        alert(`Görsel analizi tamamlandı! "${detectedType}" grafiği tespit edildi ve öneriler buna göre güncellendi.`);
      } else {
        alert(`Görselde "${detectedType}" tespit edildi ancak verinizle uyumlu değil.\nSebep: ${reason}\n\nBunun yerine size özel önerilerimizi inceleyebilirsiniz.`);
      }
    } catch (error) {
      console.error("Image analysis error:", error);
      alert("Görsel analiz edilirken bir hata oluştu.");
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  const handleDrawChart = (suggestion) => {
    setActiveSpec(suggestion.spec);
    setActiveTitle(suggestion.chart_type);
  };

  const handleCustomCommand = (command) => {
    if (!analysis) {
      alert("Lütfen önce veri yükleyin.");
      return;
    }
    const spec = parseCommand(command, analysis, uploadedData);
    if (spec) {
      setActiveSpec(spec);
      setActiveTitle(`Özel Grafik: ${command}`);
    } else {
      alert("Komut anlaşılamadı veya uygun kolon bulunamadı.");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans overflow-hidden transition-colors duration-300">
      {/* Header */}
      <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 flex justify-between items-center shadow-sm z-20">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-blue-600 to-purple-600 p-2 rounded-lg text-white shadow-lg shadow-blue-500/30">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
            Charts AI
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Image Upload Button */}
          <div className="relative group">
            <input
              type="file"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
              accept="image/*"
              disabled={isAnalyzingImage}
            />
            <label
              htmlFor="image-upload"
              className={`cursor-pointer flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 border border-purple-200 dark:border-purple-800 rounded-full text-sm font-medium transition-all duration-200 group-hover:border-purple-500/50 group-hover:shadow-md ${isAnalyzingImage ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isAnalyzingImage ? <Loader2 className="w-4 h-4 text-purple-500 animate-spin" /> : <ImageIcon className="w-4 h-4 text-purple-500" />}
              <span className="text-purple-600 dark:text-purple-400">
                {isAnalyzingImage ? "Analiz Ediliyor..." : "Grafik Yükle & Çiz"}
              </span>
            </label>
          </div>

          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>

          <div className="relative group">
            <input
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              accept=".xlsx,.xls,.csv"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium transition-all duration-200 group-hover:border-blue-500/50 group-hover:shadow-md"
            >
              <Upload className="w-4 h-4 text-blue-500" />
              {fileName ? <span className="text-blue-600 dark:text-blue-400">{fileName}</span> : "Veri Seti Yükle"}
            </label>
          </div>

          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel: Summary */}
        <div className="w-[320px] border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col z-10 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
          <SummaryPanel analysis={analysis} />
        </div>

        {/* Middle Panel: Suggestions */}
        <div className="w-[400px] border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex flex-col z-0">
          <ChartSuggestionsPanel
            suggestions={suggestions}
            onDrawChart={handleDrawChart}
          />
        </div>

        {/* Right Panel: Viewer */}
        <div className="flex-1 bg-gray-100 dark:bg-gray-950 relative">
          <ChartViewer
            spec={activeSpec}
            title={activeTitle}
            onCustomCommand={handleCustomCommand}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
