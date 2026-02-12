import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import HCPDetailsForm from '../components/HCPDetailsForm';
import SideMenu from '../components/SideMenu';
import eamLogo from '../assets/images/EAM-logo.png';
import bgImage from '../assets/images/bg01.png';

const HCPDetails: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleLogin = (data: any) => {
    console.log('Login with data:', data);
    // Navigate to carousel page
    navigate('/carousel');
  };

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      {/* Gradient Header Overlay */}
      <div className="absolute top-0 left-0 right-0 h-20 md:h-24 bg-gradient-to-r from-amber-500 via-rose-500 via-60% to-purple-600" />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header onMenuClick={toggleMenu} />
        <SideMenu isOpen={isMenuOpen} onClose={closeMenu} />
        
        <main className="flex-1 flex flex-col relative overflow-hidden">
          <div className="flex-1 px-4 md:px-8 lg:px-16 py-8">
            <div className="h-full flex items-center">
              <div className="w-full">
                <div className="p-4 md:p-8">
                  <img src={eamLogo} alt="EAM Logo" className="mb-4 eam-logo" />
                  <div className="mt-6">
                    <HCPDetailsForm onBack={handleBack} onLogin={handleLogin} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <footer className="absolute bottom-2 right-4 md:bottom-4 md:right-6 z-10">
            <p className="text-xs text-white/90 text-right drop-shadow-md">
              All the images used in this material are for illustration purposes only
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default HCPDetails;
