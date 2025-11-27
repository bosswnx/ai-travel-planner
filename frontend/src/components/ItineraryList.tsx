import React from 'react';
import type { PlanContent, ItineraryActivity } from '../services/api';
import { Calendar, MapPin, DollarSign, Clock } from 'lucide-react';

interface ItineraryListProps {
  plan: PlanContent;
}

export const ItineraryList: React.FC<ItineraryListProps> = ({ plan }) => {
  return (
    <div className="space-y-6 p-4 overflow-y-auto h-full custom-scrollbar">
      {/* Header Summary */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{plan.title}</h2>
        <p className="text-gray-600 mb-4">{plan.summary}</p>
        <div className="flex items-center space-x-4 text-sm font-medium text-gray-500">
             <span className="flex items-center"><DollarSign size={16} className="mr-1 text-green-600"/> Total: {plan.total_budget_estimate}</span>
             <span className="flex items-center"><Calendar size={16} className="mr-1 text-blue-600"/> {plan.itinerary.length} Days</span>
        </div>
      </div>

      {/* Budget Breakdown */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-700 mb-3">Estimated Budget Breakdown</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
           {Object.entries(plan.budget_breakdown).map(([key, value]) => (
             <div key={key} className="flexjustify-between p-2 bg-gray-50 rounded-lg">
               <span className="capitalize text-gray-600">{key}</span>
               <span className="font-bold text-gray-800 float-right">{value}</span>
             </div>
           ))}
        </div>
      </div>

      {/* Daily Itinerary */}
      <div className="space-y-8 relative">
        <div className="absolute left-4 top-4 bottom-0 w-0.5 bg-gray-200"></div>
        
        {plan.itinerary.map((day, index) => (
          <div key={index} className="relative pl-10">
            {/* Day Marker */}
            <div className="absolute left-0 top-0 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg z-10">
              {day.day}
            </div>

            <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-800">{day.date}</h3>
            </div>

            <div className="space-y-4">
                {day.activities.map((activity, actIndex) => (
                    <ActivityCard key={actIndex} activity={activity} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ActivityCard: React.FC<{ activity: ItineraryActivity }> = ({ activity }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center text-blue-600 font-semibold text-sm">
                    <Clock size={14} className="mr-1"/> {activity.time}
                </div>
                <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-full text-gray-600 capitalize">
                    {activity.type}
                </span>
            </div>
            <h4 className="font-bold text-gray-800 mb-1 flex items-center">
                <MapPin size={16} className="mr-1 text-red-500"/> {activity.location}
            </h4>
            <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
            <div className="text-xs text-gray-400 font-medium flex items-center">
                <DollarSign size={12} className="mr-0.5"/> {activity.cost_estimate}
            </div>
        </div>
    )
}
