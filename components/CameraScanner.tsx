import React, { useEffect, useRef, useState } from 'react';
import { X, Camera, Image as ImageIcon, RotateCcw } from 'lucide-react';

interface CameraScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Image: string) => void;
  mode: 'identify' | 'archive';
}

export const CameraScanner: React.FC<CameraScannerProps> = ({
  isOpen,
  onClose,
  onCapture,
  mode,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [permissionError, setPermissionError] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Start Camera
  const startCamera = async () => {
    try {
      setPermissionError(false);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { 
            facingMode: facingMode,
            width: { ideal: 1920 },
            height: { ideal: 1080 } 
        },
        audio: false,
      });
      
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err) {
      console.error("Camera Error:", err);
      setPermissionError(true);
    }
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      // Stop stream when closed
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen, facingMode]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64Data = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
        onCapture(base64Data);
        onClose();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const res = reader.result?.toString().split(',')[1];
            if (res) {
                onCapture(res);
                onClose();
            }
        };
        reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#264653] flex flex-col">
      {/* Hidden inputs */}
      <canvas ref={canvasRef} className="hidden" />
      <input 
        type="file" 
        ref={fileInputRef} 
        accept="image/*" 
        className="hidden" 
        onChange={handleFileUpload}
      />

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 z-10 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
        <span className="text-[#fffdf5] font-black text-xl tracking-wider drop-shadow-md font-sans">
            {mode === 'identify' ? '掃描導入 (Import)' : '掃描存檔 (Archive)'}
        </span>
        <button 
            onClick={onClose}
            className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30"
        >
            <X size={24} />
        </button>
      </div>

      {/* Camera View */}
      <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
        {permissionError ? (
            <div className="text-white text-center p-6 space-y-4 font-sans">
                <p className="text-xl font-bold">無法存取相機</p>
                <p className="text-[#d6ccc2] text-sm">請檢查瀏覽器權限，或使用相簿上傳。</p>
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 bg-[#e76f51] rounded-2xl text-white font-black shadow-[0_4px_0_0_#c75135]"
                >
                    從相簿選擇
                </button>
            </div>
        ) : (
            <>
                <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="absolute inset-0 w-full h-full object-cover opacity-90"
                />
                
                {/* Guide Frame - Retro Style */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-[85%] aspect-[3/4] border-4 border-[#fffdf5]/60 rounded-[2rem] relative shadow-[0_0_0_9999px_rgba(38,70,83,0.6)]">
                        {/* Corners */}
                        <div className="absolute top-0 left-0 w-12 h-12 border-t-8 border-l-8 border-[#e9c46a] rounded-tl-[1.5rem] -mt-[4px] -ml-[4px]"></div>
                        <div className="absolute top-0 right-0 w-12 h-12 border-t-8 border-r-8 border-[#e9c46a] rounded-tr-[1.5rem] -mt-[4px] -mr-[4px]"></div>
                        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-8 border-l-8 border-[#e9c46a] rounded-bl-[1.5rem] -mb-[4px] -ml-[4px]"></div>
                        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-8 border-r-8 border-[#e9c46a] rounded-br-[1.5rem] -mb-[4px] -mr-[4px]"></div>
                        
                        <div className="absolute top-1/2 left-0 right-0 text-center -translate-y-1/2">
                            <p className="text-[#fffdf5] text-lg font-black drop-shadow-md bg-[#264653]/50 inline-block px-4 py-1 rounded-full">SCAN HERE</p>
                        </div>
                    </div>
                </div>
            </>
        )}
      </div>

      {/* Controls */}
      <div className="bg-[#264653] p-6 pb-12 flex justify-around items-center relative z-10 rounded-t-[2rem]">
        <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-4 rounded-2xl bg-[#1a313a] text-[#fffdf5] border-2 border-[#5c4d3c] active:scale-95 transition-transform"
            title="相簿"
        >
            <ImageIcon size={24} />
        </button>

        <button 
            onClick={handleCapture}
            disabled={permissionError}
            className="w-24 h-24 rounded-full border-8 border-[#f4f1ea]/20 flex items-center justify-center bg-[#e76f51] shadow-[0_6px_0_0_#c75135] active:shadow-none active:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <Camera size={40} className="text-white" />
        </button>

        <button 
            onClick={() => setFacingMode(prev => prev === 'user' ? 'environment' : 'user')}
            className="p-4 rounded-2xl bg-[#1a313a] text-[#fffdf5] border-2 border-[#5c4d3c] active:scale-95 transition-transform"
            title="切換鏡頭"
        >
            <RotateCcw size={24} />
        </button>
      </div>
    </div>
  );
};