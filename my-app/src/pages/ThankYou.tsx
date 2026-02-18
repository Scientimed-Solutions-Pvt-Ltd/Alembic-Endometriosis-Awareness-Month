import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import thanksBg from '../assets/images/thanks-bg.png';

const ThankYou: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [pledgeCount, setPledgeCount] = useState(0);
  const targetCount = 1234; // Target number to count up to (can be fetched from API)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Format count to 4 digits
  const formatCount = (count: number): string[] => {
    return count.toString().padStart(4, '0').split('');
  };

  // Animated counter effect
  useEffect(() => {
    const duration = 2000; // Animation duration in ms
    const steps = 60; // Number of steps
    const increment = targetCount / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= targetCount) {
        setPledgeCount(targetCount);
        clearInterval(timer);
      } else {
        setPledgeCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, []);

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
        style={{ backgroundImage: `url(${thanksBg})` }}
      />
      
      {/* Gradient Header Overlay */}
      {/* <div className="absolute top-0 left-0 right-0 h-20 md:h-24 bg-gradient-to-r from-amber-500 via-rose-500 via-60% to-purple-600" /> */}
      
      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* <Header onMenuClick={toggleMenu} />
        <SideMenu isOpen={isMenuOpen} onClose={closeMenu} /> */}
        
        <main className="flex-1 flex items-center justify-center text-center">
          <div className="w-[90%] md:w-[80%] flex flex-col gap-4 md:gap-8 justify-center items-center py-8 text-center">
            {/* Live Count Title */}
            <h2 className="hdng1">
              Live count of pledges taken by<br />the Doctors across India
            </h2>

            {/* Counter Display */}
            <div className="flex items-center justify-center gap-2 my-4">
              {formatCount(pledgeCount).map((digit, index) => (
                <div 
                  key={index}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-lg flex items-center justify-center shadow-md counterbg">
                  <span>{digit}</span>
                </div>
              ))}
            </div>

            {/* Thank You Message */}
            <h1 className="text-5xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-relaxed">
              Thank you
            </h1>
            
            <p className="thanktext">
              for supporting us and for pledging your participation in <b><i>#ISupportYellowMarch</i></b>
            <br />
             <span>Endometriosis Awareness Month</span>
            </p>
          </div>
          
          {/* <footer className="absolute bottom-2 right-4 md:bottom-4 md:right-6 z-10">
            <p className="text-xs text-gray-600 text-right">
              All the images used in this material are for illustration purposes only
            </p>
          </footer> */}
        </main>
      </div>
    </div>
  );
};

export default ThankYou;
