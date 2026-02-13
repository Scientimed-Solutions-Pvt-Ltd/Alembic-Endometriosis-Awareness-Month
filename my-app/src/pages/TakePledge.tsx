import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';

// Extend Window interface for SpeechRecognition API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => ISpeechRecognition;
    webkitSpeechRecognition: new () => ISpeechRecognition;
  }
}

const TakePledge: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [ribbonImage, setRibbonImage] = useState('./src/assets/images/ribbon-g.png');
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Speech recognition states
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  
  const navigate = useNavigate();
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  // Target words to detect from "I support yellow march"
  const targetWords = ['i', 'support', 'yellow', 'march'];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  /**
   * Checks if any target word is found in the transcript
   * @param text - The transcript text to check
   * @returns boolean indicating if a match was found
   */
  const checkForTargetWords = (text: string): boolean => {
    const lowerText = text.toLowerCase();
    return targetWords.some(word => lowerText.includes(word));
  };

  /**
   * Handles successful speech detection
   * Stops recognition and navigates to thank-you page
   */
  const handleSuccessfulDetection = () => {
    // Stop speech recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    // Update visual states
    setIsListening(false);
    setIsAnimating(true);
    
    // Change ribbon image to colored version
    setTimeout(() => {
      setRibbonImage('./src/assets/images/ribbon-c.png');
    }, 300);
    
    console.log('Speech detected! Navigating to thank-you page...');
    
    // Navigate to thank-you page after brief delay for visual feedback
    setTimeout(() => {
      navigate('/thank-you');
    }, 1000);
  };

  /**
   * Initializes and starts speech recognition
   */
  const startSpeechRecognition = () => {
    // Check browser support
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognitionAPI) {
      setError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      setIsSupported(false);
      return;
    }

    // Create new recognition instance
    const recognition = new SpeechRecognitionAPI();
    recognitionRef.current = recognition;

    // Configure recognition settings
    recognition.continuous = true; // Keep listening until stopped
    recognition.interimResults = true; // Get results while speaking
    recognition.lang = 'en-US'; // Set language to English

    // Handle speech recognition start
    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      setTranscript('');
      console.log('Speech recognition started');
    };

    // Handle speech recognition results
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';

      // Process all results
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      const combinedTranscript = finalTranscript || interimTranscript;
      setTranscript(combinedTranscript);
      console.log('Transcript:', combinedTranscript);

      // Check if any target word is detected
      if (checkForTargetWords(combinedTranscript)) {
        console.log('Target word detected in:', combinedTranscript);
        handleSuccessfulDetection();
      }
    };

    // Handle speech recognition errors
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);

      switch (event.error) {
        case 'not-allowed':
          setError('Microphone access denied. Please allow microphone permissions and try again.');
          break;
        case 'no-speech':
          setError('No speech detected. Please try again and speak clearly.');
          break;
        case 'audio-capture':
          setError('No microphone found. Please connect a microphone and try again.');
          break;
        case 'network':
          setError('Network error occurred. Please check your connection.');
          break;
        default:
          setError(`Speech recognition error: ${event.error}`);
      }
    };

    // Handle speech recognition end
    recognition.onend = () => {
      console.log('Speech recognition ended');
      // Only reset if not navigating
      if (!isAnimating) {
        setIsListening(false);
      }
    };

    // Request microphone permission and start recognition
    try {
      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setError('Failed to start speech recognition. Please try again.');
    }
  };

  /**
   * Stops speech recognition manually
   */
  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  /**
   * Handles pledge button click - starts speech recognition
   */
  const handlePledgeClick = () => {
    if (isListening) {
      // If already listening, stop recognition
      stopSpeechRecognition();
    } else {
      // Start speech recognition
      setError(null);
      startSpeechRecognition();
    }
  };

  // Cleanup speech recognition on component unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
        recognitionRef.current = null;
      }
    };
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
                    {isListening ? 'Listening... Say the phrase!' : 'Click below and say'}
                  </p>
                  
                  {/* Recording Indicator - Shows when listening */}
                  {isListening && (
                    <div className="flex flex-col items-center justify-center mb-6">
                      {/* Pulsing Mic Animation */}
                      <div className="relative flex items-center justify-center">
                        {/* Outer pulse rings */}
                        <div className="absolute w-24 h-24 bg-red-400 rounded-full animate-ping opacity-20"></div>
                        <div className="absolute w-20 h-20 bg-red-500 rounded-full animate-ping opacity-30 animation-delay-200"></div>
                        {/* Inner mic circle */}
                        <div className="relative w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg z-10">
                          {/* Mic Icon */}
                          <svg 
                            className="w-8 h-8 text-white animate-pulse" 
                            fill="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5z"/>
                            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                          </svg>
                        </div>
                      </div>
                      {/* Transcript display */}
                      {transcript && (
                        <p className="mt-4 text-sm text-gray-600 italic">
                          Heard: "{transcript}"
                        </p>
                      )}
                    </div>
                  )}
                  
                  {/* Error Message Display */}
                  {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
                      {error}
                    </div>
                  )}
                  
                  {/* Browser Support Warning */}
                  {!isSupported && (
                    <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg text-yellow-700 text-sm">
                      Speech recognition not supported. Please use Chrome, Edge, or Safari.
                    </div>
                  )}
                  
                  <button
                    onClick={handlePledgeClick}
                    disabled={!isSupported}
                    className={`relative inline-flex items-center gap-2 rounded-full shadow-lg transition-all duration-300 mb-8 pldgbtn ${
                      isListening 
                        ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                        : 'hover:shadow-xl hover:-translate-y-1'
                    } ${!isSupported ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {isListening ? 'Stop Listening' : '"I Support Yellow March"'}
                    {!isListening && (
                      <span className="clickgif">
                        <img src='./src/assets/images/click.gif' alt="Click Animation" />
                      </span>
                    )}
                  </button>
                  
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-purple-900 leading-relaxed mb-8 text-center">
                    {isListening ? 'Say "I Support Yellow March"' : 'to take pledge'}
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
