import React, { useState } from 'react';
import { VoiceInput } from './components/VoiceInput';
import { TravelMap } from './components/TravelMap';
import { ItineraryList } from './components/ItineraryList';
import { generatePlan, type TripPlan } from './services/api';
import { Send, Plane, Map as MapIcon, Loader2 } from 'lucide-react';

function App() {
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<TripPlan | null>(null);

  const handleGenerate = async () => {
    if (!userInput.trim()) return;

    setIsLoading(true);
    try {
      const plan = await generatePlan(userInput);
      setCurrentPlan(plan);
    } catch (error) {
      console.error("Failed to generate plan:", error);
      alert("Failed to generate plan. Please check backend logs.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 flex-col font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm z-20">
        <div className="flex items-center space-x-2 text-blue-600">
          <Plane size={28} className="transform -rotate-45" />
          <h1 className="text-xl font-bold tracking-tight">AI 旅行规划师</h1>
        </div>
        <div className="text-sm text-gray-500">
           基于 React + FastAPI + 通义千问
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel: Input & Itinerary */}
        <div className="w-full md:w-5/12 flex flex-col border-r border-gray-200 bg-white z-10 shadow-xl">
           
           {/* Input Section */}
           <div className="p-4 border-b border-gray-100 bg-gray-50">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                你想去哪里？
              </label>
              <div className="relative">
                <textarea
                  className="w-full p-4 pr-12 rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm resize-none text-sm"
                  rows={3}
                  placeholder="例如：帮我规划一个去日本京都的5天行程，预算1万人民币，喜欢动漫和美食。"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                />
                <div className="absolute bottom-3 right-3 flex space-x-2">
                   <VoiceInput 
                      onTranscript={(text) => setUserInput(prev => prev + " " + text)} 
                      isProcessing={isLoading}
                   />
                   <button 
                      onClick={handleGenerate}
                      disabled={isLoading || !userInput.trim()}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-md disabled:opacity-50 transition-colors"
                   >
                      {isLoading ? <Loader2 size={24} className="animate-spin"/> : <Send size={24} />}
                   </button>
                </div>
              </div>
           </div>

           {/* Itinerary Display Area */}
           <div className="flex-1 overflow-y-auto bg-gray-50 relative">
              {isLoading ? (
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 space-y-4">
                    <Loader2 size={48} className="animate-spin text-blue-500"/>
                    <p className="animate-pulse">AI 正在为你规划完美旅程...</p>
                 </div>
              ) : currentPlan ? (
                 <ItineraryList plan={currentPlan.content} />
              ) : (
                 <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                    <MapIcon size={64} className="mb-4 opacity-20"/>
                    <p className="text-lg font-medium text-gray-500">准备好出发了吗？</p>
                    <p className="text-sm">告诉我你的目的地、日期和偏好，即刻启程。</p>
                 </div>
              )}
           </div>
        </div>

        {/* Right Panel: Map */}
        <div className="hidden md:block flex-1 bg-gray-100 relative">
           <TravelMap location={currentPlan?.content?.itinerary[0]?.activities[0]?.location} />
        </div>
      </main>
    </div>
  );
}

export default App;