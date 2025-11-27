import React from 'react';
import { Map, Marker, APILoader } from '@uiw/react-amap';

interface TravelMapProps {
  location?: string; // Center location name
}

export const TravelMap: React.FC<TravelMapProps> = ({ location }) => {
  // Use environment variables
  const AMAP_KEY = import.meta.env.VITE_AMAP_KEY || "";
  const SECURITY_CODE = import.meta.env.VITE_AMAP_SECURITY_CODE || "";

  // Inject security code global
  if (typeof window !== 'undefined' && SECURITY_CODE) {
     // @ts-ignore
    window._AMapSecurityConfig = {
      securityJsCode: SECURITY_CODE,
    };
  }

  if (!AMAP_KEY) {
      return (
          <div className="w-full h-full rounded-xl overflow-hidden shadow-lg border border-gray-200 relative bg-gray-100 flex items-center justify-center">
            <div className="text-center p-4">
               <p className="text-red-600 font-bold mb-2">AMap API Key Missing</p>
               <p className="text-sm text-gray-600">Please add VITE_AMAP_KEY to frontend/.env</p>
            </div>
          </div>
      )
  }

  return (
    <div className="w-full h-full rounded-xl overflow-hidden shadow-lg border border-gray-200 relative">
      <div style={{ width: '100%', height: '100%' }}>
        <APILoader akey={AMAP_KEY}>
            <Map 
                zoom={10} 
                center={[116.397428, 39.90923]} // Default to Beijing
            >
               <Marker position={[116.397428, 39.90923]} />
            </Map>
        </APILoader>
      </div>
    </div>
  );
};