'use client';

import { useState, useEffect, useRef } from 'react';
import { Info, AlertCircle, CheckCircle, Leaf, ArrowRight, X } from 'lucide-react';
import ImageUploadAndCamera from './components/ImageUploadAndCamera';
import DashboardLayout from '../components/DashboardLayout';

const getDiseaseIcon = (disease: string) => {
  switch (disease?.toLowerCase()) {
    case 'blight':
      return <AlertCircle className="text-amber-600" size={24} />;
    case 'healthy':
      return <CheckCircle className="text-green-600" size={24} />;
    default:
      return <Info className="text-blue-600" size={24} />;
  }
};

const translateDiseaseName = (disease: string) => disease || 'Unknown Disease';
const translateDiseaseDetails = (text: string) => text || 'No information available.';

export default function LeafDetectionPage() {
  const [userName, setUserName] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('user');
    if (stored) {
      try {
        const u = JSON.parse(stored);
        setUserName(u.name || '');
      } catch { }
    }
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setResults(null);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch('https://stirring-morally-chamois.ngrok-free.app/predict', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setResults(data.result ?? data);
      setTimeout(() => {
        reportRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error(err);
      setResults({ error: 'Detection failed' });
    } finally {
      setLoading(false);
    }
  };


  return (
    <DashboardLayout>
      <div className="min-h-screen bg-emerald-50 p-6 lg:p-12">
        <div className="flex items-center space-x-3 mb-8">
          <Leaf className="text-emerald-600" size={32} />
          <h1 className="text-2xl md:text-3xl font-bold text-emerald-800">
            Leaf Disease Detection
          </h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-stretch min-h-[500px]">
          {/* Left Column - Upload Section */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-emerald-100 self-start h-full">
            <p className="text-gray-600 mb-6 text-center">
              Upload a plant leaf image to identify diseases and get treatment recommendations
            </p>

            <div className="relative">
              <ImageUploadAndCamera
                file={file}
                setFile={setFile}
                preview={preview}
                setPreview={setPreview}
              />
            </div>

            {/* Detect button */}
            {file && !loading && (
              <button
                onClick={handleUpload}
                className="mt-6 w-full py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Detect Disease</span>
                <ArrowRight size={18} />
              </button>
            )}

            {/* Loading indicator */}
            {loading && (
              <div className="mt-8 flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-emerald-800 font-medium">Analyzing leaf image...</p>
              </div>
            )}
          </div>

          {/* Right Column - Results Section */}
          <div ref={reportRef} className="space-y-6 h-full">
            {results && (
              <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-emerald-200 animate-fadeIn h-full flex flex-col">
                <div className="flex items-center space-x-4 mb-6 pb-4 border-b-2 border-emerald-100">
                  {getDiseaseIcon(results.disease)}
                  <h2 className="text-2xl md:text-3xl font-bold text-emerald-800">
                    {translateDiseaseName(results.disease)}
                  </h2>
                </div>

                <div className="space-y-6 flex-1">
                  <div className="p-5 bg-emerald-50 rounded-xl shadow-sm hover:shadow-md transition group">
                    <h3 className="text-lg font-semibold text-blue-700 flex items-center">
                      <Info size={20} className="mr-2" /> Description
                    </h3>
                    <p className="mt-3 text-gray-700 leading-relaxed group-hover:text-blue-900 transition">
                      {translateDiseaseDetails(results.description)}
                    </p>
                  </div>
                  <div className="p-5 bg-amber-50 rounded-xl shadow-sm hover:shadow-md transition group">
                    <h3 className="text-lg font-semibold text-amber-600 flex items-center">
                      <AlertCircle size={20} className="mr-2" /> Symptoms
                    </h3>
                    <p className="mt-3 text-gray-700 leading-relaxed group-hover:text-amber-900 transition">
                      {translateDiseaseDetails(results.symptoms)}
                    </p>
                  </div>
                  <div className="p-5 bg-green-50 rounded-xl shadow-sm hover:shadow-md transition group">
                    <h3 className="text-lg font-semibold text-green-700 flex items-center">
                      <CheckCircle size={20} className="mr-2" /> Solution
                    </h3>
                    <p className="mt-3 text-gray-700 leading-relaxed group-hover:text-green-900 transition">
                      {translateDiseaseDetails(results.solution)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!results && (
              <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-emerald-200 text-center h-full flex items-center justify-center flex-col">
                <Leaf className="mx-auto text-emerald-400 mb-4" size={64} />
                <p className="text-gray-600">
                  Your leaf detection results will appear here after uploading an image
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
