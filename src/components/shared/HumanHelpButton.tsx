import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HumanHelpButtonProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  showLabel?: boolean;
}

const HumanHelpButton: React.FC<HumanHelpButtonProps> = ({ 
  position = 'bottom-right',
  showLabel = true
}) => {
  const navigate = useNavigate();
  const [clickCount, setClickCount] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-right':
        return 'bottom-20 right-6';
      case 'bottom-left':
        return 'bottom-20 left-6';
      case 'top-right':
        return 'top-20 right-6';
      case 'top-left':
        return 'top-20 left-6';
      default:
        return 'bottom-20 right-6';
    }
  };

  const handleClick = () => {
    setClickCount(prev => prev + 1);
    
    // Reset click count after 500ms if no second click
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }
    
    clickTimerRef.current = setTimeout(() => {
      setClickCount(0);
    }, 500);
  };

  useEffect(() => {
    // If double-clicked, navigate to human help page
    if (clickCount >= 2) {
      setIsActive(true);
      navigate('/human-help');
      setClickCount(0);
      
      // Reset active state after animation
      setTimeout(() => {
        setIsActive(false);
      }, 1000);
    }
  }, [clickCount, navigate]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
      }
    };
  }, []);

  return (
    <div className={`fixed ${getPositionClasses()} z-40 block`}>
      {/* Help Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleClick}
        className={`flex items-center space-x-2 px-4 py-3 ${
          isActive 
            ? 'bg-gradient-to-r from-green-600 to-emerald-600' 
            : 'bg-gradient-to-r from-green-900/70 to-emerald-900/70 border border-green-800/50'
        } rounded-full shadow-lg text-white`}
      >
        <Users className="w-5 h-5" />
        {showLabel && <span className="font-medium">Human Help</span>}
        {isActive && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
          />
        )}
      </motion.button>
    </div>
  );
};

export default HumanHelpButton;