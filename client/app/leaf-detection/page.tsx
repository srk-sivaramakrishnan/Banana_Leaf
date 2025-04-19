'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Settings,
  LogOut,
  User as UserIcon,
  Info,
  AlertCircle,
  CheckCircle,
  Camera,
} from 'lucide-react';
import Dropzone from 'react-dropzone';

// Utility to pick an icon based on disease name
const getDiseaseIcon = (disease: string) => {
  switch (disease?.toLowerCase()) {
    case 'blight':
      return <AlertCircle className="text-amber-600" size={24} />;
    case 'healthy':
      return <CheckCircle className="text-green-700" size={24} />;
    default:
      return <Info className="text-blue-700" size={24} />;
  }
};

// Utility to format disease name
const translateDiseaseName = (disease: string) => disease || 'Unknown Disease';

// Utility to format details text
const translateDiseaseDetails = (text: string) => text || 'No information available.';

export default function LeafDetectionPage() {
  const [userName, setUserName] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const reportRef = useRef<HTMLDivElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [showLiveCamera, setShowLiveCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('user');
    if (stored) {
      try {
        const u = JSON.parse(stored);
        setUserName(u.name || '');
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  }, [file]);

  const handleDrop = useCallback((accepted: File[]) => {
    if (accepted.length > 0) setFile(accepted[0]);
  }, []);

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setFile(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setResults(null);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch('/api/leaf-detect', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setResults(data);
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

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = '/signin';
  };

  const startDesktopCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      setShowLiveCamera(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error('Camera access denied or failed', err);
    }
  };

  const captureFromVideo = () => {
    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    if (video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => {
        if (blob) {
          const capturedFile = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
          setFile(capturedFile);
          setPreview(URL.createObjectURL(blob));
        }
      }, 'image/jpeg');
    }
    stream?.getTracks().forEach(track => track.stop());
    setShowLiveCamera(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <UserIcon className="text-gray-600" />
          <span className="font-medium text-gray-800">{userName}</span>
        </div>
        <div className="flex items-center space-x-6">
          <Settings className="cursor-pointer text-gray-600 hover:text-gray-800" />
          <LogOut
            className="cursor-pointer text-gray-600 hover:text-gray-800"
            onClick={handleLogout}
          />
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-semibold mb-6 text-gray-800">
            Leaf Disease Detection
          </h1>

          {/* Drag & drop */}
          <Dropzone onDrop={handleDrop} accept={{ 'image/*': [] }} multiple={false}>
            {({ getRootProps, getInputProps, isDragActive }) => (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                  isDragActive
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 bg-white'
                }`}
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p className="text-gray-700">Drop the image here…</p>
                ) : (
                  <p className="text-gray-500">
                    Drag & drop an image here, or click to select one
                  </p>
                )}
              </div>
            )}
          </Dropzone>

          {/* Mobile camera capture */}
          <div className="mt-4 text-center">
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Camera size={20} />
              Use Mobile Camera
            </button>
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleCameraCapture}
            />
          </div>

          {/* Desktop camera capture */}
          <div className="mt-4 text-center">
            <button
              onClick={startDesktopCamera}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              <Camera size={20} />
              Open Desktop Camera
            </button>
          </div>

          {/* Live Camera View */}
          {showLiveCamera && (
            <div className="mt-6 text-center">
              <video ref={videoRef} className="mx-auto rounded-lg shadow max-h-64" />
              <button
                onClick={captureFromVideo}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Capture Photo
              </button>
            </div>
          )}

          {/* Preview */}
          {preview && (
            <div className="mt-6 text-center">
              <img
                src={preview}
                alt="Selected image preview"
                className="mx-auto max-h-64 rounded-lg shadow"
              />
            </div>
          )}

          {/* Upload button */}
          {file && !loading && (
            <button
              onClick={handleUpload}
              className="mt-6 w-full py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition"
            >
              Detect Disease
            </button>
          )}

          {/* Loading state */}
          {loading && <p className="mt-6 text-center text-gray-600">Detecting…</p>}

          <div ref={reportRef} />

          {/* Results */}
          {results && (
            <div className="mt-6 p-6 bg-white rounded-lg shadow border border-emerald-100">
              <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-emerald-100">
                {getDiseaseIcon(results.disease)}
                <h2 className="text-2xl font-bold text-emerald-800">
                  {translateDiseaseName(results.disease)}
                </h2>
              </div>
              <div className="space-y-6">
                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-blue-700 flex items-center">
                    <Info size={20} className="mr-2" />
                    Description
                  </h3>
                  <p className="mt-2 text-gray-700">
                    {translateDiseaseDetails(results.description)}
                  </p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-amber-600 flex items-center">
                    <AlertCircle size={20} className="mr-2" />
                    Symptoms
                  </h3>
                  <p className="mt-2 text-gray-700">
                    {translateDiseaseDetails(results.symptoms)}
                  </p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-green-700 flex items-center">
                    <CheckCircle size={20} className="mr-2" />
                    Solution
                  </h3>
                  <p className="mt-2 text-gray-700">
                    {translateDiseaseDetails(results.solution)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
