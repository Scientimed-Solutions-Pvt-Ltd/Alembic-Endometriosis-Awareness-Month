import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';

const TakePledge: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [ribbonImage, setRibbonImage] = useState('./src/assets/images/ribbon-g.png');
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handlePledgeClick = () => {
    // Start animation
    setIsAnimating(true);
    
    // After scale down animation, change the image
    setTimeout(() => {
      setRibbonImage('./src/assets/images/ribbon-c.png');
    }, 300);
    
    console.log('I Support Yellow March pledge taken!');
    
    // Redirect to thank you page after 3 seconds
    setTimeout(() => {
      navigate('/thank-you');
    }, 2000);
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
    <div className="min-h-screen flex flex-col relative bg-white">
      {/* Gradient Header Overlay */}
      <div className="absolute top-0 left-0 right-0 h-20 md:h-24 bg-gradient-to-r from-amber-500 via-rose-500 via-60% to-purple-600" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header onMenuClick={toggleMenu} />
        <SideMenu isOpen={isMenuOpen} onClose={closeMenu} />
   
       <main className="flex-1 flex items-center justify-center text-center">
  <div className="w-[80%] flex flex-col md:flex-row gap-4 justify-center items-center py-16 text-center">
                {/* Gray Awareness Ribbon */}
                 <div className="w-full md:w-[25%] text-center">
                 <img 
                   src={ribbonImage} 
                   alt="Awareness Ribbon" 
                   className={`m-auto transition-all duration-500 ease-in-out ${
                     isAnimating 
                       ? 'scale-110 rotate-3' 
                       : 'scale-100 rotate-0'
                   }`}
                 />
                </div>

                {/* Text Content */}
               <div className="w-full md:w-[75%] text-center">
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-purple-900 leading-relaxed mb-8 text-center">
                    I pledge to raise awareness of endometriosis with the goal of improving the quality of life for every woman affected
                  </p>
                  
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-purple-900 leading-relaxed mb-8 text-center">
                    Click below and say
                  </p>
                  
                  <button
                    onClick={handlePledgeClick}
                    className="relative inline-flex items-center gap-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 mb-8 pldgbtn">
                    "I Support Yellow March"
                    <span className="clickgif">
                        <img src='./src/assets/images/click.gif' alt="Click Animation" /></span>
                  </button>
                  
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-purple-900 leading-relaxed mb-8 text-center">
                    to take pledge
                  </p>
                </div>
              </div>
            
          
          <footer className="absolute bottom-2 right-4 md:bottom-4 md:right-6 z-10">
            <p className="text-xs text-gray-600 text-right">
              All the images used in this material are for illustration purposes only
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default TakePledge;
