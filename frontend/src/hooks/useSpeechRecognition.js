import { useEffect, useRef, useState } from 'react';

export const useSpeechRecognition = () => {
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setSupported(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'zh-CN';
    recognition.interimResults = false;
    recognitionRef.current = recognition;
  }, []);

  const listen = ({ onResult, onError }) => {
    if (!recognitionRef.current) return;

    const recognition = recognitionRef.current;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult?.(transcript);
      setListening(false);
    };

    recognition.onerror = (event) => {
      onError?.(event.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    setListening(true);
    recognition.start();
  };

  return { listen, listening, supported };
};
