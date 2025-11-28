import React, { useState, useMemo, useEffect } from 'react';
import { VoiceInput } from '../components/VoiceInput';
import { TravelMap } from '../components/TravelMap';
import { ItineraryList } from '../components/ItineraryList';
import { generatePlan, getMyPlans, deletePlan, type TripPlan } from '../services/api';
import { Send, Plane, Map as MapIcon, Loader2, LogOut, History, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<TripPlan | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [historyPlans, setHistoryPlans] = useState<TripPlan[]>([]);
  const { logout, username } = useAuth();

  const handleGenerate = async () => {
    if (!userInput.trim()) return;

    setIsLoading(true);
    try {
      const plan = await generatePlan(userInput);
      setCurrentPlan(plan);
      // Refresh history
      loadHistory();
    } catch (error) {
      console.error("Failed to generate plan:", error);
      alert("Failed to generate plan. Please check backend logs.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadHistory = async () => {
    try {
        const plans = await getMyPlans();
        setHistoryPlans(plans);
    } catch (error) {
        console.error("Failed to load history:", error);
    }
  };

  const handleDeletePlan = async (e: React.MouseEvent, planId: number) => {
      e.stopPropagation(); // Prevent triggering the list item click
      if (window.confirm("Are you sure you want to delete this plan?")) {
          try {
              await deletePlan(planId);
              setHistoryPlans(prev => prev.filter(p => p.id !== planId));
              if (currentPlan?.id === planId) {
                  setCurrentPlan(null);
              }
          } catch (error) {
              console.error("Failed to delete plan:", error);
              alert("Failed to delete plan.");
          }
      }
  };

  useEffect(() => {
      loadHistory();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  }

  const locationNames = useMemo(() => {
    if (!currentPlan?.content?.itinerary) return [];
    const uniqueLocations = new Set<string>();
    currentPlan.content.itinerary.forEach(day => {
      day.activities.forEach(activity => {
        let loc = activity.location;
        // Client-side cleaning: remove parentheses and extra context
        loc = loc.replace(/（.*?）/g, '').replace(/\(.*?\)/g, ''); // Remove parens
        loc = loc.split(/[-:：]/)[0]; // Take first part before separators
        loc = loc.replace(/附近.*$/, ''); // Remove "nearby..." suffix if common
        loc = loc.trim();
        
        if (loc && loc.length > 1) { // Basic filter
             uniqueLocations.add(loc);
        }
      });
    });
    return Array.from(uniqueLocations);
  }, [currentPlan]);

  return (
    <div className="flex h-screen bg-gray-50 flex-col font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm z-20">
        <div className="flex items-center space-x-2 text-blue-600">
          <Plane size={28} className="transform -rotate-45" />
          <h1 className="text-xl font-bold tracking-tight">AI 旅行规划师</h1>
        </div>
        <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Hi, {username}</span>
            <button onClick={() => setShowHistory(!showHistory)} className="text-gray-500 hover:text-blue-600" title="My Plans">
                <History size={24} />
            </button>
            <button onClick={logout} className="text-gray-500 hover:text-red-600" title="Logout">
                <LogOut size={24} />
            </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* History Sidebar (Overlay) */}
        {showHistory && (
            <div className="absolute top-0 left-0 bottom-0 w-64 bg-white shadow-2xl z-30 border-r overflow-y-auto transform transition-transform duration-300">
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="font-bold text-lg">My Plans</h3>
                    <button onClick={() => setShowHistory(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
                </div>
                <ul>
                    {historyPlans.map(plan => (
                        <li key={plan.id} 
                            className={`p-3 border-b hover:bg-blue-50 cursor-pointer flex justify-between items-center group ${currentPlan?.id === plan.id ? 'bg-blue-100' : ''}`}
                            onClick={() => {
                                setCurrentPlan(plan);
                                setShowHistory(false);
                            }}
                        >
                            <div className="overflow-hidden">
                                <div className="font-medium text-sm truncate">{plan.title}</div>
                                <div className="text-xs text-gray-500">{new Date(plan.created_at).toLocaleDateString()}</div>
                            </div>
                            <button 
                                onClick={(e) => handleDeletePlan(e, plan.id)}
                                className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                title="Delete Plan"
                            >
                                <Trash2 size={16} />
                            </button>
                        </li>
                    ))}
                    {historyPlans.length === 0 && (
                        <li className="p-4 text-center text-gray-500 text-sm">No plans yet.</li>
                    )}
                </ul>
            </div>
        )}

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
           <TravelMap locations={locationNames} />
        </div>
      </main>
    </div>
  );
}

export default Home;
