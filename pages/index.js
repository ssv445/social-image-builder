import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import html2canvas from 'html2canvas';

// Default values
const DEFAULT_CONFIG = {
  backgroundUrl: 'https://picsum.photos/800/600',
  foregroundUrl: 'https://picsum.photos/200',
  message: 'Welcome',
  name: 'Guest',
  msgX: 50,
  msgY: 50,
  nameX: 50,
  nameY: 100,
  fgX: 300,
  fgY: 200
};

export default function Home() {
  const router = useRouter();
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [bgDimensions, setBgDimensions] = useState({ width: 0, height: 0 });

  // Load URL params on mount
  useEffect(() => {
    if (!router.isReady) return;
    
    const urlConfig = {
      backgroundUrl: router.query.bg || DEFAULT_CONFIG.backgroundUrl,
      foregroundUrl: router.query.fg || DEFAULT_CONFIG.foregroundUrl,
      message: router.query.msg || DEFAULT_CONFIG.message,
      name: router.query.name || DEFAULT_CONFIG.name,
      msgX: parseInt(router.query.msgX) || DEFAULT_CONFIG.msgX,
      msgY: parseInt(router.query.msgY) || DEFAULT_CONFIG.msgY,
      nameX: parseInt(router.query.nameX) || DEFAULT_CONFIG.nameX,
      nameY: parseInt(router.query.nameY) || DEFAULT_CONFIG.nameY,
      fgX: parseInt(router.query.fgX) || DEFAULT_CONFIG.fgX,
      fgY: parseInt(router.query.fgY) || DEFAULT_CONFIG.fgY,
    };
    setConfig(urlConfig);
  }, [router.isReady, router.query]);

  // Handle file uploads
  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setConfig(prev => ({ ...prev, [type]: url }));

      if (type === 'backgroundUrl') {
        const img = new Image();
        img.onload = () => {
          setBgDimensions({ width: img.naturalWidth, height: img.naturalHeight });
        };
        img.src = url;
      }
    }
  };

  // Handle download
  const handleDownload = async () => {
    const preview = document.getElementById('preview');
    const canvas = await html2canvas(preview, { scale: 3 });
    const link = document.createElement('a');
    link.download = 'personalized-image.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-[200px]">
      {/* Preview Section */}
      <div className="relative w-full h-[60vh] bg-white shadow-lg">
        <div id="preview" className="relative w-full h-full max-w-4xl mx-auto">
          <img 
            src={config.backgroundUrl} 
            alt="Background" 
            className="w-full h-full object-contain"
          />
          <img
            src={config.foregroundUrl}
            alt="Foreground"
            className="absolute w-24 h-24 rounded-full object-cover"
            style={{ left: config.fgX, top: config.fgY }}
          />
          <div 
            className="absolute text-white text-2xl font-bold drop-shadow-lg"
            style={{ left: config.msgX, top: config.msgY }}
          >
            {config.message}
          </div>
          <div 
            className="absolute text-white text-xl font-semibold drop-shadow-lg"
            style={{ left: config.nameX, top: config.nameY }}
          >
            {config.name}
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="max-w-4xl mx-auto p-4">
          {/* Sliding Panel for Controls */}
          <div className="space-y-4">
            {/* File Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Background Image
                </label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => handleImageUpload(e, 'backgroundUrl')} 
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {bgDimensions.width > 0 && (
                  <p className="text-sm text-gray-500">
                    {bgDimensions.width} x {bgDimensions.height}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Foreground Image
                </label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => handleImageUpload(e, 'foregroundUrl')} 
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>

            {/* Text Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Message Controls */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <input
                  type="text"
                  value={config.message}
                  onChange={(e) => setConfig(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm text-gray-600">X</label>
                    <input
                      type="number"
                      value={config.msgX}
                      onChange={(e) => setConfig(prev => ({ ...prev, msgX: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm text-gray-600">Y</label>
                    <input
                      type="number"
                      value={config.msgY}
                      onChange={(e) => setConfig(prev => ({ ...prev, msgY: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Name Controls */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={config.name}
                  onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm text-gray-600">X</label>
                    <input
                      type="number"
                      value={config.nameX}
                      onChange={(e) => setConfig(prev => ({ ...prev, nameX: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm text-gray-600">Y</label>
                    <input
                      type="number"
                      value={config.nameY}
                      onChange={(e) => setConfig(prev => ({ ...prev, nameY: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons - Moved to bottom */}
            <div className="flex gap-4 pt-4 border-t">
              <button 
                onClick={() => {
                  // Force a re-render of the preview
                  const preview = document.getElementById('preview');
                  if (preview) {
                    preview.style.opacity = '0.99';
                    setTimeout(() => {
                      preview.style.opacity = '1';
                    }, 50);
                  }
                }}
                className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-gray-700 active:bg-gray-800 transition-colors"
              >
                Regenerate Preview
              </button>
              <button 
                onClick={handleDownload}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors"
              >
                Download Image
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}