import { useState, useEffect, useCallback, useRef } from 'react';
import { Camera, Upload, X, Image } from 'lucide-react';
import Dropzone from 'react-dropzone';

interface ImageUploadAndCameraProps {
  file: File | null;
  setFile: (file: File | null) => void;
  preview: string | null;
  setPreview: (preview: string | null) => void;
}

export default function ImageUploadAndCamera({
  file,
  setFile,
  preview,
  setPreview,
}: ImageUploadAndCameraProps) {
  const [showLiveCamera, setShowLiveCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // generate preview when file changes
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  }, [file, setPreview]);

  // clean up MediaStream on unmount or when a new stream is set
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [stream]);

  // when the video element appears and we have a stream, hook it up
  useEffect(() => {
    if (showLiveCamera && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current
        .play()
        .catch((err) => console.error('Video play failed:', err));
    }
  }, [showLiveCamera, stream]);

  const handleDrop = useCallback((accepted: File[]) => {
    if (accepted.length > 0) setFile(accepted[0]);
  }, [setFile]);

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setFile(files[0]);
    }
  };

  const handleCameraClick = () => {
    const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/.test(
      navigator.userAgent
    );
    if (isMobile) {
      cameraInputRef.current?.click();
    } else {
      startDesktopCamera();
    }
  };

  const startDesktopCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
      });
      setStream(mediaStream);
      setShowLiveCamera(true);
    } catch (err) {
      console.error('Camera access denied or failed', err);
    }
  };

  const captureFromVideo = () => {
    const video = videoRef.current;
    if (video) {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          const capturedFile = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
          setFile(capturedFile);
          setPreview(URL.createObjectURL(blob));
        }
      }, 'image/jpeg');
    }
    // stop camera once captured
    stream?.getTracks().forEach((t) => t.stop());
    setShowLiveCamera(false);
  };

  const clearImage = () => {
    setFile(null);
    setPreview(null);
  };

  return (
    <div className="space-y-6">
      {!preview && !showLiveCamera && (
        <>
          <Dropzone onDrop={handleDrop} accept={{ 'image/*': [] }} multiple={false}>
            {({ getRootProps, getInputProps, isDragActive }) => (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                  isDragActive
                    ? 'border-emerald-500 bg-emerald-50 shadow-inner'
                    : 'border-emerald-200 bg-white hover:border-emerald-400 hover:bg-emerald-50'
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Image size={28} className="text-emerald-600" />
                  </div>
                  {isDragActive ? (
                    <p className="text-emerald-700 font-medium">Drop the image here...</p>
                  ) : (
                    <>
                      <p className="text-emerald-800 font-medium mb-2">Drag & drop your leaf image here</p>
                      <p className="text-gray-500 text-sm">or click to browse files</p>
                    </>
                  )}
                </div>
              </div>
            )}
          </Dropzone>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleCameraClick}
              className="flex-1 py-3 px-4 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition shadow-sm flex items-center justify-center gap-2"
            >
              <Camera size={20} />
              <span>Use Camera</span>
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
        </>
      )}

      {showLiveCamera && (
        <div className="mt-6 bg-gray-900 p-4 rounded-xl">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="mx-auto w-full max-w-lg rounded-lg"
          />
          <div className="flex justify-center mt-4 gap-4">
            <button
              onClick={captureFromVideo}
              className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 flex items-center gap-2"
            >
              <Camera size={18} />
              <span>Capture Photo</span>
            </button>
            <button
              onClick={() => {
                stream?.getTracks().forEach(t => t.stop());
                setShowLiveCamera(false);
              }}
              className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 flex items-center gap-2"
            >
              <X size={18} />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      )}

      {preview && (
        <div className="mt-6">
          <div className="relative">
            <img
              src={preview}
              alt="Selected leaf image"
              className="mx-auto w-full max-w-md rounded-xl shadow-md border-4 border-white"
            />
            <button 
              onClick={clearImage}
              className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-red-100"
            >
              <X size={20} className="text-red-600" />
            </button>
          </div>
          <p className="text-center mt-4 text-emerald-700 font-medium">
            Image ready for analysis
          </p>
        </div>
      )}
    </div>
  );
}