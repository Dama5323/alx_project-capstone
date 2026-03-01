import React, { useState, useEffect, useCallback } from 'react';

const useVoiceSearch = (onSearch) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setSupported(false);
    }
  }, []);

  const startListening = useCallback(() => {
    if (!supported) {
      alert('Voice search is not supported in your browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event) => {
      let text = event.results[0][0].transcript;
      
      // Clean the text: remove periods, commas, and extra spaces
      text = text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '') // Remove punctuation
                 .replace(/\s+/g, ' ') // Replace multiple spaces with single space
                 .trim(); // Remove leading/trailing spaces
      
      console.log('Original transcript:', event.results[0][0].transcript);
      console.log('Cleaned city name:', text);
      
      setTranscript(text);
      onSearch(text);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      // Show user-friendly message
      if (event.error === 'no-speech') {
        alert('No speech detected. Please try again.');
      }
    };

    recognition.start();
  }, [supported, onSearch]);

  return { isListening, transcript, startListening, supported };
};

const VoiceSearchButton = ({ onSearch }) => {
  const { isListening, startListening, supported } = useVoiceSearch(onSearch);

  if (!supported) return null;

  return (
    <button
      onClick={startListening}
      className={`
        p-3 rounded-full transition-all duration-300
        ${isListening 
          ? 'bg-red-500 text-white animate-pulse scale-110' 
          : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
        }
      `}
      title="Search by voice"
    >
      <svg 
        className="w-5 h-5" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" 
        />
      </svg>
    </button>
  );
};

export default VoiceSearchButton;