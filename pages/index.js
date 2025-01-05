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
    <div className="container">
      <div className="controls">
        <div className="upload-section">
          <div>
            <label>Background Image:</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => handleImageUpload(e, 'backgroundUrl')} 
            />
            {bgDimensions.width > 0 && (
              <p>Dimensions: {bgDimensions.width} x {bgDimensions.height}</p>
            )}
          </div>
          <div>
            <label>Foreground Image:</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => handleImageUpload(e, 'foregroundUrl')} 
            />
          </div>
        </div>

        <div className="text-section">
          <div>
            <label>Message:</label>
            <input
              type="text"
              value={config.message}
              onChange={(e) => setConfig(prev => ({ ...prev, message: e.target.value }))}
            />
            <div>
              <label>X:</label>
              <input
                type="number"
                value={config.msgX}
                onChange={(e) => setConfig(prev => ({ ...prev, msgX: parseInt(e.target.value) }))}
              />
              <label>Y:</label>
              <input
                type="number"
                value={config.msgY}
                onChange={(e) => setConfig(prev => ({ ...prev, msgY: parseInt(e.target.value) }))}
              />
            </div>
          </div>

          <div>
            <label>Name:</label>
            <input
              type="text"
              value={config.name}
              onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
            />
            <div>
              <label>X:</label>
              <input
                type="number"
                value={config.nameX}
                onChange={(e) => setConfig(prev => ({ ...prev, nameX: parseInt(e.target.value) }))}
              />
              <label>Y:</label>
              <input
                type="number"
                value={config.nameY}
                onChange={(e) => setConfig(prev => ({ ...prev, nameY: parseInt(e.target.value) }))}
              />
            </div>
          </div>
        </div>

        <button onClick={handleDownload}>Download Image</button>
      </div>

      <div id="preview" className="preview">
        <img src={config.backgroundUrl} alt="Background" className="background" />
        <img
          src={config.foregroundUrl}
          alt="Foreground"
          className="foreground"
          style={{ left: config.fgX, top: config.fgY }}
        />
        <div 
          className="text message"
          style={{ left: config.msgX, top: config.msgY }}
        >
          {config.message}
        </div>
        <div 
          className="text name"
          style={{ left: config.nameX, top: config.nameY }}
        >
          {config.name}
        </div>
      </div>
    </div>
  );
}