import React from 'react';
import { Map, Marker } from '@uiw/react-amap';

interface TravelMapProps {
  location?: string; // Center location name
}

export const TravelMap: React.FC<TravelMapProps> = ({ location }) => {
  // Note: In a real app, you would use the AMap Geocoding plugin to convert 'location' string to lat/long.
  // For this prototype, we default to a fixed view or let the user pan around.
  // We rely on the user providing valid keys in .env

  // Use environment variables or fallbacks (User needs to set these!)
  // Note: Vite uses import.meta.env
  const AMAP_KEY = import.meta.env.VITE_AMAP_KEY || "";
  const SECURITY_CODE = import.meta.env.VITE_AMAP_SECURITY_CODE || "";

  // Inject security code global
  if (typeof window !== 'undefined' && SECURITY_CODE) {
     // @ts-ignore
    window._AMapSecurityConfig = {
      securityJsCode: SECURITY_CODE,
    };
  }

  return (
    <div className="w-full h-full rounded-xl overflow-hidden shadow-lg border border-gray-200 relative">
       {!AMAP_KEY && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-100 bg-opacity-90 p-4 text-center">
            <div>
               <p className="text-red-600 font-bold mb-2">AMap API Key Missing</p>
               <p className="text-sm text-gray-600">Please add VITE_AMAP_KEY to frontend/.env</p>
            </div>
          </div>
       )}
      <div style={{ width: '100%', height: '100%' }}>
        <Map 
            amapkey={AMAP_KEY} 
            zoom={10} 
            center={[116.397428, 39.90923]} // Default to Beijing
        >
           <Marker position={[116.397428, 39.90923]} />
        </Map>
      </div>
    </div>
  );
};
