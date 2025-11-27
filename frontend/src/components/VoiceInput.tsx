import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  isProcessing: boolean;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript, isProcessing }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.lang = 'zh-CN'; // Default to Chinese
      recog.interimResults = false;

      recog.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
        setIsListening(false);
      };

      recog.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recog.onend = () => {
        setIsListening(false);
      };

      setRecognition(recog);
    }
  }, [onTranscript]);

  const toggleListening = () => {
    if (isProcessing) return;

    if (isListening) {
      recognition?.stop();
    } else {
      recognition?.start();
      setIsListening(true);
    }
  };

  if (!recognition) {
    return <div className="text-xs text-gray-400">浏览器不支持语音识别</div>;
  }

  return (
    <button
      onClick={toggleListening}
      disabled={isProcessing}
      className={`p-3 rounded-full transition-all ${
        isListening 
          ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
          : 'bg-blue-600 hover:bg-blue-700'
      } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
      title={isListening ? "正在聆听..." : "点击开始语音输入"}
    >
      {isListening ? <MicOff size={24} /> : <Mic size={24} />}
    </button>
  );
};
