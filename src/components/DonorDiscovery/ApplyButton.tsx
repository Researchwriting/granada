import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ApplyModal from '../shared/ApplyModal';
import { RealDonorOpportunity } from '../../services/realDonorSearchEngine';
import InteractiveTooltip from '../shared/InteractiveTooltip';

interface ApplyButtonProps {
  opportunity: RealDonorOpportunity;
  className?: string;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

const ApplyButton: React.FC<ApplyButtonProps> = ({
  opportunity,
  className = '',
  variant = 'primary',
  size = 'md',
  showTooltip = false
}) => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const getButtonClasses = () => {
    let baseClasses = 'flex items-center justify-center space-x-2 rounded-lg transition-all';
    
    // Size classes
    if (size === 'sm') {
      baseClasses += ' py-1 px-3 text-sm';
    } else if (size === 'md') {
      baseClasses += ' py-2 px-4';
    } else if (size === 'lg') {
      baseClasses += ' py-3 px-6 text-lg';
    }
    
    // Variant classes
    if (variant === 'primary') {
      baseClasses += ' bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg';
    } else {
      baseClasses += ' bg-green-600/20 border border-green-500/30 text-green-400 hover:bg-green-600/30';
    }
    
    return `${baseClasses} ${className}`;
  };

  const handleGenerateProposal = () => {
    // Navigate to proposal generator with opportunity data
    navigate('/proposal-generator', { 
      state: { 
        opportunityTitle: opportunity.title,
        donorName: opportunity.donor.name,
        description: opportunity.description,
        fundingAmount: opportunity.fundingAmount.max || opportunity.fundingAmount.min
      } 
    });
  };

  const button = (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setShowModal(true)}
      className={getButtonClasses()}
    >
      <Send className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      <span>Apply</span>
      {variant === 'primary' && <ExternalLink className="w-3 h-3" />}
    </motion.button>
  );

  if (showTooltip) {
    return (
      <>
        <InteractiveTooltip
          content={
            <p>Start your application process with multiple options: direct application, AI-generated proposal, or expert assistance.</p>
          }
          title="Apply for Funding"
        >
          {button}
        </InteractiveTooltip>
        
        <ApplyModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          opportunityTitle={opportunity.title}
          donorName={opportunity.donor.name}
          applicationUrl={opportunity.contactInfo?.applicationUrl || opportunity.donor.website}
          onGenerateProposal={handleGenerateProposal}
        />
      </>
    );
  }
  
  return (
    <>
      {button}
      
      <ApplyModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        opportunityTitle={opportunity.title}
        donorName={opportunity.donor.name}
        applicationUrl={opportunity.contactInfo?.applicationUrl || opportunity.donor.website}
        onGenerateProposal={handleGenerateProposal}
      />
    </>
  );
};

export default ApplyButton;