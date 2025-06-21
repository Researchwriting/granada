import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, RefreshCw, Download, Maximize, Minimize } from 'lucide-react';
import { donorScraperService } from '../../services/donorScraperService';

interface ScreenshotViewerProps {
  url: string;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

const ScreenshotViewer: React.FC<ScreenshotViewerProps> = ({
  url,
  isOpen,
  onClose,
  title
}) => {
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    if (isOpen && url) {
      loadScreenshot();
    }
  }, [isOpen, url]);

  const loadScreenshot = async () => {
    if (!url) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const screenshotData = await donorScraperService.getScreenshot(url);
      setScreenshot(screenshotData);
    } catch (err) {
      console.error('Error loading screenshot:', err);
      setError('Failed to load screenshot');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadScreenshot();
  };

  const handleDownload = () => {
    if (!screenshot) return;
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = screenshot;
    link.download = `screenshot-${new Date().getTime()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenUrl = () => {
    window.open(url, '_blank');
  };

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`fixed z-50 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl overflow-hidden ${
          fullscreen ? 'inset-4' : 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-4xl max-h-[90vh]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
          <div className="flex items-center space-x-3 truncate">
            <h3 className="text-lg font-bold text-white truncate">{title || url}</h3>
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={handleRefresh}
              disabled={loading}
              className="p-2 text-slate-400 hover:text-white transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={handleDownload}
              disabled={!screenshot || loading}
              className="p-2 text-slate-400 hover:text-white transition-colors disabled:opacity-50"
            >
              <Download className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={handleOpenUrl}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={toggleFullscreen}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              {fullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
        
        {/* Content */}
        <div className="overflow-auto" style={{ maxHeight: fullscreen ? 'calc(100% - 65px)' : '70vh' }}>
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <RefreshCw className="w-12 h-12 text-blue-400 animate-spin" />
              <p className="text-slate-300 ml-4">Loading screenshot...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center p-12">
              <p className="text-red-400 mb-4">{error}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={handleRefresh}
                className="px-4 py-2 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-700 transition-all"
              >
                Try Again
              </motion.button>
            </div>
          ) : screenshot ? (
            <div className="p-4">
              <img 
                src={screenshot} 
                alt="Website Screenshot" 
                className="w-full h-auto rounded-lg border border-slate-700/50"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center p-12">
              <p className="text-slate-300">No screenshot available</p>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-slate-700/50 text-sm text-slate-400">
          <div className="flex items-center justify-between">
            <span className="truncate">{url}</span>
            <span>Captured: {new Date().toLocaleString()}</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ScreenshotViewer;