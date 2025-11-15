
import React, { useState, useCallback } from 'react';
import { fileToBase64, fileToText } from './utils/file';
import { analyzeDesign } from './services/geminiService';
import type { Report, ApiError } from './types';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import ReportDisplay from './components/ReportDisplay';
import { DatabaseIcon, DocumentTextIcon, DocumentIcon, ExclamationTriangleIcon, LightBulbIcon } from './components/Icons';

const App: React.FC = () => {
  const [chromaDbFile, setChromaDbFile] = useState<File | null>(null);
  const [faultsJsonFile, setFaultsJsonFile] = useState<File | null>(null);
  const [cadPdfFile, setCadPdfFile] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canAnalyze = chromaDbFile && faultsJsonFile && cadPdfFile && !isLoading;

  const handleAnalyzeClick = useCallback(async () => {
    if (!canAnalyze) return;

    setIsLoading(true);
    setReport(null);
    setError(null);

    try {
      const cadPdfBase64 = await fileToBase64(cadPdfFile);
      const faultsJsonText = await fileToText(faultsJsonFile);

      if (!cadPdfBase64.startsWith('data:application/pdf;base64,')) {
          throw new Error("Failed to read PDF file correctly.");
      }

      const generatedReport = await analyzeDesign(
        cadPdfBase64,
        faultsJsonText,
        chromaDbFile.name,
        cadPdfFile.type,
      );
      setReport(generatedReport);
    } catch (e) {
      const apiError = e as ApiError;
      console.error("Analysis failed:", apiError);
      setError(apiError.message || 'An unknown error occurred during analysis.');
    } finally {
      setIsLoading(false);
    }
  }, [canAnalyze, cadPdfFile, faultsJsonFile, chromaDbFile]);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <FileUpload
                id="chromadb-upload"
                label="ChromaDB File"
                onFileChange={setChromaDbFile}
                acceptedTypes=".zip,.db"
                icon={<DatabaseIcon className="w-8 h-8 text-indigo-400" />}
              />
              <FileUpload
                id="faults-upload"
                label="Faults JSON"
                onFileChange={setFaultsJsonFile}
                acceptedTypes=".json"
                icon={<DocumentTextIcon className="w-8 h-8 text-teal-400" />}
              />
              <FileUpload
                id="cad-upload"
                label="CAD Drawing PDF"
                onFileChange={setCadPdfFile}
                acceptedTypes=".pdf"
                icon={<DocumentIcon className="w-8 h-8 text-rose-400" />}
              />
            </div>

            <div className="text-center mb-8">
              <button
                onClick={handleAnalyzeClick}
                disabled={!canAnalyze}
                className={`w-full md:w-1/2 px-8 py-4 text-lg font-bold text-white rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2 dark:focus:ring-offset-gray-800
                  ${canAnalyze 
                    ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 focus:ring-purple-500' 
                    : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                  }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </div>
                ) : 'Generate Inspection Report'}
              </button>
            </div>
          </div>
          
          <div className="px-6 md:px-8 pb-8">
             {error && (
              <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded-r-lg" role="alert">
                <div className="flex items-center">
                    <ExclamationTriangleIcon className="w-6 h-6 mr-3 text-red-500"/>
                    <div>
                        <p className="font-bold">Analysis Failed</p>
                        <p>{error}</p>
                    </div>
                </div>
              </div>
            )}

            {!isLoading && !report && !error && (
              <div className="text-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                <LightBulbIcon className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4"/>
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Ready for Analysis</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Upload all three required files and click the "Generate" button to start the AI inspection process.</p>
              </div>
            )}
            
            <ReportDisplay report={report} isLoading={isLoading} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
