"use client";
import React, {
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  FC,
  ReactElement,
} from "react";
import {
  UploadCloud,
  ImagePlus,
  XCircle,
  AlertCircle,
  CheckCircle,
  Info,
  Download,
  Globe,
  Camera,
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// --------------------------------------------------
// Interfaces and Types
// --------------------------------------------------
interface DiseasePredictionResults {
  disease: string;
  description: string;
  symptoms: string;
  solution: string;
}

interface Translation {
  title: string;
  subtitle: string;
  uploadPrompt: string;
  processButton: string;
  processing: string;
  noImageSelected: string;
  uploadFailed: string;
  processSuccess: string;
  description: string;
  symptoms: string;
  solution: string;
  processToSee: string;
  uploadToStart: string;
  downloadReport: string;
  switchToTamil: string;
  switchToEnglish: string;
  openCamera: string;
  capturePhoto: string;
  closeCamera: string;
  cameraError: string;
}

// --------------------------------------------------
// Translation data
// --------------------------------------------------
const translations: { [key: string]: Translation } = {
  english: {
    title: "Banana Leaf Disease Prediction",
    subtitle: "Upload a banana leaf image for disease detection",
    uploadPrompt: "Drag and drop or click to upload",
    processButton: "Process Image",
    processing: "Processing...",
    noImageSelected: "Please select an image to upload.",
    uploadFailed: "Failed to upload image",
    processSuccess: "Image processed successfully",
    description: "Description",
    symptoms: "Symptoms",
    solution: "Solution",
    processToSee: "Process the image to see disease prediction results",
    uploadToStart: "Upload an image to get started",
    downloadReport: "Download Report",
    switchToTamil: "தமிழ்",
    switchToEnglish: "English",
    openCamera: "Open Camera",
    capturePhoto: "Capture Photo",
    closeCamera: "Close Camera",
    cameraError: "Error opening camera or permission denied.",
  },
  tamil: {
    title: "வாழை இலை நோய் கண்டறிதல்",
    subtitle: "நோய் கண்டறிதலுக்கு வாழை இலை படத்தைப் பதிவேற்றவும்",
    uploadPrompt: "இழுத்து விடவும் அல்லது பதிவேற்ற கிளிக் செய்யவும்",
    processButton: "படத்தை செயலாக்கு",
    processing: "செயலாக்குகிறது...",
    noImageSelected: "பதிவேற்ற ஒரு படத்தைத் தேர்ந்தெடுக்கவும்.",
    uploadFailed: "படத்தைப் பதிவேற்ற முடியவில்லை",
    processSuccess: "படம் வெற்றிகரமாக செயலாக்கப்பட்டது",
    description: "விளக்கம்",
    symptoms: "அறிகுறிகள்",
    solution: "தீர்வு",
    processToSee: "நோய் கண்டறிதல் முடிவுகளைக் காண படத்தைச் செயலாக்கவும்",
    uploadToStart: "தொடங்க ஒரு படத்தைப் பதிவேற்றவும்",
    downloadReport: "அறிக்கையைப் பதிவிறக்கவும்",
    switchToTamil: "தமிழ்",
    switchToEnglish: "English",
    openCamera: "கேமராவைத் திறக்கவும்",
    capturePhoto: "புகைப்படம் எடுக்கவும்",
    closeCamera: "கேமராவை மூடவும்",
    cameraError: "கேமராவைத் திறப்பதில் பிழை அல்லது அனுமதி மறுக்கப்பட்டது.",
  },
};

// --------------------------------------------------
// Tamil translations for diseases
// --------------------------------------------------
const diseaseTranslations: { [key: string]: string } = {
  "Banana Black Sigatoka Disease": "வாழை கருப்பு சிகடோகா நோய்",
  "Banana Bract Mosaic Virus Disease": "வாழை பிராக்ட் மொசைக் வைரஸ் நோய்",
  "Banana Healthy Leaf": "ஆரோக்கியமான வாழை இலை",
  "Banana Insect Pest Disease": "வாழை பூச்சி தொற்று நோய்",
  "Banana Moko Disease": "வாழை மோகோ நோய்",
  "Banana Panama Disease": "வாழை பனாமா நோய்",
  "Banana Yellow Sigatoka Disease": "வாழை மஞ்சள் சிகடோகா நோய்",
};

// --------------------------------------------------
// Tamil translations for disease details
// --------------------------------------------------
const diseaseDetailsTranslations: { [key: string]: string } = {
  "A fungal disease causing dark streaks on leaves.":
    "இலைகளில் கருமையான கோடுகளை ஏற்படுத்தும் பூஞ்சை நோய்.",
  "Black streaks, yellowing of leaves, reduced yield.":
    "கருப்பு கோடுகள், இலைகள் மஞ்சளாதல், விளைச்சல் குறைதல்.",
  "Use fungicides, remove infected leaves, ensure proper spacing.":
    "பூஞ்சைக்கொல்லிகளைப் பயன்படுத்தவும், பாதிக்கப்பட்ட இலைகளை அகற்றவும், சரியான இடைவெளியை உறுதிசெய்யவும்.",

  "A viral disease that causes mosaic patterns on leaves.":
    "இலைகளில் மொசைக் வடிவங்களை உருவாக்கும் வைரஸ் நோய்.",
  "Mosaic leaf pattern, twisted leaves, poor fruit development.":
    "மொசைக் இலை வடிவம், சுருண்ட இலைகள், பழ வளர்ச்சி குறைவு.",
  "Use virus-free planting material, control insect vectors.":
    "வைரஸ் இல்லாத நடவு பொருட்களைப் பயன்படுத்தவும், பூச்சி வெக்டார்களைக் கட்டுப்படுத்தவும்.",

  "The leaf is healthy with no signs of disease.":
    "இலை நோயின் அறிகுறிகள் எதுவுமின்றி ஆரோக்கியமாக உள்ளது.",
  "Green and intact leaf structure.":
    "பச்சை மற்றும் சேதமில்லாத இலை அமைப்பு.",
  "Maintain good agricultural practices.":
    "நல்ல விவசாய நடைமுறைகளை பராமரிக்கவும்.",

  "Damage caused by insects such as banana weevils and aphids.":
    "வாழை வண்டு மற்றும் அபிட்ஸ் போன்ற பூச்சிகளால் ஏற்படும் சேதம்.",
  "Holes in leaves, damaged fruit, insect presence.":
    "இலைகளில் துளைகள், சேதமடைந்த பழம், பூச்சிகளின் இருப்பு.",
  "Use biological control methods and pesticides.":
    "உயிரியல் கட்டுப்பாட்டு முறைகளையும் பூச்சிக்கொல்லிகளையும் பயன்படுத்தவும்.",

  "A bacterial disease that causes wilting and fruit rot.":
    "வாடல் மற்றும் பழ அழுகலை ஏற்படுத்தும் பாக்டீரியா நோய்.",
  "Wilting of leaves, fruit discoloration, bacterial ooze.":
    "இலைகள் வாடல், பழ நிறமாற்றம், பாக்டீரியா கசிவு.",
  "Destroy infected plants, avoid cross-contamination.":
    "பாதிக்கப்பட்ட செடிகளை அழிக்கவும், குறுக்கு மாசுபாட்டைத் தவிர்க்கவும்.",

  "A soil-borne fungal disease causing plant wilt.":
    "தாவர வாட்டத்தை ஏற்படுத்தும் மண்ணில் உள்ள பூஞ்சை நோய்.",
  "Yellowing of leaves, stunted growth, root rot.":
    "இலைகள் மஞ்சளாதல், குன்றிய வளர்ச்சி, வேர் அழுகல்.",
  "Use resistant varieties, improve drainage.":
    "எதிர்ப்புத் திறன் கொண்ட வகைகளைப் பயன்படுத்தவும், வடிகால் அமைப்பை மேம்படுத்தவும்.",

  "A fungal disease causing yellow spots on leaves.":
    "இலைகளில் மஞ்சள் புள்ளிகளை ஏற்படுத்தும் பூஞ்சை நோய்.",
  "Yellow streaks, premature leaf drop.":
    "மஞ்சள் கோடுகள், முன்கூட்டிய இலை உதிர்தல்.",
  "Apply fungicides, improve aeration around plants.":
    "பூஞ்சைக்கொல்லிகளைப் பயன்படுத்தவும், தாவரங்களைச் சுற்றி காற்றோட்டத்தை மேம்படுத்தவும்.",
};

// --------------------------------------------------
// Helper functions
// --------------------------------------------------
function translateDiseaseDetails(text: string, language: string): string {
  if (language === "english") return text;
  return diseaseDetailsTranslations[text] || text;
}

function translateDiseaseName(diseaseName: string, language: string): string {
  if (language === "english") return diseaseName;
  return diseaseTranslations[diseaseName] || diseaseName;
}

// --------------------------------------------------
// Main Component
// --------------------------------------------------
const DiseasesPrediction: FC = (): ReactElement => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [results, setResults] = useState<DiseasePredictionResults | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>("english");

  // For the downloadable report
  const reportRef = useRef<HTMLDivElement>(null);

  // Camera states and refs
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraInitialized, setCameraInitialized] = useState<boolean>(false);

  // Current translations
  const t: Translation = translations[language];

  // --------------------------------------------------
  // File upload handlers
  // --------------------------------------------------
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
      setMessage("");
      setResults(null);
    }
  };

  const resetUpload = (): void => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(null);
    setPreviewUrl("");
    setMessage("");
    setResults(null);
  };

  // --------------------------------------------------
  // Camera-related handlers
  // --------------------------------------------------
  useEffect(() => {
    if (isCameraOpen && videoRef.current && cameraStream && !cameraInitialized) {
      const video = videoRef.current;
      video.srcObject = cameraStream;

      video.onloadedmetadata = () => {
        video
          .play()
          .then(() => {
            console.log(
              "Video is playing. Dimensions:",
              video.videoWidth,
              video.videoHeight
            );
            setCameraInitialized(true);
          })
          .catch((error) => {
            console.error("Error playing video:", error);
            setMessage(t.cameraError);
          });
      };

      video.onerror = () => {
        console.error("Video element error");
        setMessage(t.cameraError);
      };
    }
  }, [isCameraOpen, cameraStream, cameraInitialized, t.cameraError]);

  const openCamera = async (): Promise<void> => {
    setMessage(""); // clear any old error
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
      });
      console.log("Camera stream opened:", stream);
      setCameraStream(stream);
      setIsCameraOpen(true);
      setCameraInitialized(false); // Reset initialization flag
    } catch (error) {
      console.error("Error opening camera:", error);
      setMessage(t.cameraError);
    }
  };

  const closeCamera = (): void => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
    }
    setIsCameraOpen(false);
    setCameraStream(null);
    setCameraInitialized(false);
  };

  const capturePhoto = (): void => {
    if (!videoRef.current || !cameraInitialized) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const fileFromCamera = new File([blob], "captured.png", {
              type: "image/png",
            });
            setFile(fileFromCamera);
            const objectUrl = URL.createObjectURL(blob);
            setPreviewUrl(objectUrl);
            closeCamera();
          }
        },
        "image/png",
        1.0
      );
    }
  };

  // Clean up camera resources when component unmounts
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  // --------------------------------------------------
  // Image processing
  // --------------------------------------------------
  const uploadImage = async (): Promise<void> => {
    if (!file) {
      setMessage(t.noImageSelected);
      return;
    }
    setIsProcessing(true);
    setMessage("");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch('https://rationally-polite-dodo.ngrok-free.app/predict', {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(t.processSuccess);
        setResults(data.result || data);
      } else {
        setMessage(data.error || "Error processing image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setMessage(t.uploadFailed);
    } finally {
      setIsProcessing(false);
    }
  };

  // --------------------------------------------------
  // Language toggle
  // --------------------------------------------------
  const toggleLanguage = (): void => {
    setLanguage((prev) => (prev === "english" ? "tamil" : "english"));
  };

  // --------------------------------------------------
  // PDF download
  // --------------------------------------------------
  const downloadReport = async (): Promise<void> => {
    if (!reportRef.current || !results) return;
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const now = new Date();
      const timestamp = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.setFontSize(10);
      pdf.text(`Report generated on: ${timestamp}`, 10, imgHeight + 10);
      pdf.save(`banana-disease-report-${now.getTime()}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setMessage("Failed to generate PDF report");
    }
  };

  // --------------------------------------------------
  // Utility for showing an icon based on disease
  // --------------------------------------------------
  const getDiseaseIcon = (diseaseName?: string): ReactElement => {
    // Guard against undefined or non-string values
    if (!diseaseName || typeof diseaseName !== "string") {
      return <Info size={24} className="text-gray-500" />;
    }
    if (
      diseaseName.includes("Healthy") ||
      diseaseName.includes("ஆரோக்கியமான")
    ) {
      return <CheckCircle size={24} className="text-green-500" />;
    }
    return <AlertCircle size={24} className="text-red-500" />;
  };

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-5xl">
        {/* Header with improved styling */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-emerald-800 mb-2">
              {t.title}
            </h1>
            <p className="text-emerald-600">{t.subtitle}</p>
          </div>
          <button
            onClick={toggleLanguage}
            className="flex items-center bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-medium py-2 px-4 rounded-full transition-colors"
          >
            <Globe size={18} className="mr-2" />
            {language === "english" ? t.switchToTamil : t.switchToEnglish}
          </button>
        </div>
  
        {/* Main layout with improved grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Upload & Camera with better visual cues */}
          <div className="flex flex-col items-center">
            {!previewUrl && !isCameraOpen ? (
              <div className="border-2 border-dashed border-emerald-300 bg-emerald-50 rounded-xl p-8 text-center w-full max-w-md mb-6 hover:border-emerald-500 transition-all">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="fileUpload"
                />
                <label
                  htmlFor="fileUpload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <UploadCloud size={48} className="text-emerald-500 mb-4" />
                  <p className="text-emerald-700 font-medium mb-2">{t.uploadPrompt}</p>
                  <p className="text-emerald-600 text-sm">JPEG, PNG, WebP</p>
                </label>
              </div>
            ) : previewUrl ? (
              <div className="relative mb-6 w-full">
                <button
                  onClick={resetUpload}
                  className="absolute top-2 right-2 bg-white rounded-full shadow-md p-1 hover:bg-gray-100 z-10"
                >
                  <XCircle size={24} className="text-red-500" />
                </button>
                <img
                  src={previewUrl}
                  alt="Captured or Uploaded"
                  className="max-w-full h-auto rounded-lg shadow-lg border-4 border-white"
                />
              </div>
            ) : null}
  
            {/* Camera View with improved controls */}
            {isCameraOpen && (
              <div className="relative mb-6 w-full flex flex-col items-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full max-w-md rounded-lg shadow-lg border-4 border-white"
                  style={{ height: "auto", maxHeight: "400px" }}
                />
                <div className="mt-4 flex space-x-4">
                  <button
                    onClick={capturePhoto}
                    disabled={!cameraInitialized}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2 disabled:opacity-50 shadow-md"
                  >
                    <span>{t.capturePhoto}</span>
                  </button>
                  <button
                    onClick={closeCamera}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 shadow-md"
                  >
                    <span>{t.closeCamera}</span>
                  </button>
                </div>
              </div>
            )}
  
            {/* Camera Button with improved style */}
            {!previewUrl && !isCameraOpen && (
              <button
                onClick={openCamera}
                className="mt-4 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2 shadow-md"
              >
                <Camera size={20} />
                <span>{t.openCamera}</span>
              </button>
            )}
  
            {/* Process Button with better loading state */}
            {previewUrl && !results && (
              <button
                onClick={uploadImage}
                disabled={isProcessing}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 mb-4 shadow-md"
              >
                {isProcessing ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t.processing}
                  </div>
                ) : (
                  <>
                    <ImagePlus size={20} />
                    <span>{t.processButton}</span>
                  </>
                )}
              </button>
            )}
  
            {/* Message Box with improved visibility */}
            {message && (
              <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded-md mt-4 w-full shadow-sm">
                {message}
              </div>
            )}
          </div>
  
          {/* Right Column: Results with better card design */}
          <div ref={reportRef}>
            {results && (
              <div className="bg-gradient-to-br from-white to-emerald-50 p-6 rounded-xl shadow-md border border-emerald-100">
                <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-emerald-100">
                  {getDiseaseIcon(results?.disease)}
                  <h2 className="text-2xl font-bold text-emerald-800">
                    {translateDiseaseName(results?.disease, language)}
                  </h2>
                </div>
                <div className="space-y-6">
                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-blue-700 flex items-center">
                      <Info size={20} className="mr-2" />
                      {t.description}
                    </h3>
                    <p className="mt-2 text-gray-700">
                      {translateDiseaseDetails(results?.description, language)}
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-amber-600 flex items-center">
                      <AlertCircle size={20} className="mr-2" />
                      {t.symptoms}
                    </h3>
                    <p className="mt-2 text-gray-700">
                      {translateDiseaseDetails(results?.symptoms, language)}
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-green-700 flex items-center">
                      <CheckCircle size={20} className="mr-2" />
                      {t.solution}
                    </h3>
                    <p className="mt-2 text-gray-700">
                      {translateDiseaseDetails(results?.solution, language)}
                    </p>
                  </div>
                </div>
              </div>
            )}
  
            {/* Empty states with improved visual cues */}
            {!results && previewUrl && (
              <div className="bg-white p-8 rounded-xl shadow-md h-full flex items-center justify-center border border-gray-100">
                <div className="text-center">
                  <ImagePlus size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">{t.processToSee}</p>
                </div>
              </div>
            )}
  
            {!previewUrl && !isCameraOpen && (
              <div className="bg-white p-8 rounded-xl shadow-md h-full flex items-center justify-center border border-gray-100">
                <div className="text-center">
                  <UploadCloud size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">{t.uploadToStart}</p>
                  <p className="text-sm text-gray-400 mt-2">Take a clear photo of the banana leaf for accurate results</p>
                </div>
              </div>
            )}
  
            {isCameraOpen && (
              <div className="bg-white p-8 rounded-xl shadow-md h-full flex items-center justify-center border border-gray-100">
                <div className="text-center">
                  <Camera size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Position the banana leaf in the camera view and capture a clear photo
                  </p>
                  <p className="text-sm text-gray-400 mt-2">Ensure good lighting for best results</p>
                </div>
              </div>
            )}
          </div>
        </div>
  
        {/* Download button with improved styling */}
        {results && (
          <div className="mt-8 text-center">
            <button
              onClick={downloadReport}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2 mx-auto shadow-md"
            >
              <Download size={20} />
              <span>{t.downloadReport}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiseasesPrediction;
