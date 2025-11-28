import React, { useEffect, useRef, useState } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';

interface TravelMapProps {
  locations: string[]; // List of location names
  city?: string; // City to scope the search
}

export const TravelMap: React.FC<TravelMapProps> = ({ locations, city }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  const AMAP_KEY = import.meta.env.VITE_AMAP_KEY || "";
  const SECURITY_CODE = import.meta.env.VITE_AMAP_SECURITY_CODE || "";

  // Inject security code global
  if (typeof window !== 'undefined' && SECURITY_CODE) {
    // @ts-ignore
    window._AMapSecurityConfig = {
      securityJsCode: SECURITY_CODE,
    };
  }

  // Load Map
  useEffect(() => {
    if (!AMAP_KEY) return;

    AMapLoader.load({
      key: AMAP_KEY,
      version: "2.0",
      plugins: ['AMap.Marker', 'AMap.ToolBar', 'AMap.Scale', 'AMap.PlaceSearch', 'AMap.Geocoder'], 
    })
      .then((AMap) => {
        if (!mapContainerRef.current) return;

        if (!mapInstanceRef.current) {
          mapInstanceRef.current = new AMap.Map(mapContainerRef.current, {
            viewMode: "2D", 
            zoom: 10,
            center: [116.397428, 39.90923], 
          });
          
          mapInstanceRef.current.add(new AMap.ToolBar());
          mapInstanceRef.current.add(new AMap.Scale());
          setIsMapReady(true);
        }
      })
      .catch((e) => {
        console.error("AMap load failed", e);
      });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
        setIsMapReady(false);
      }
    };
  }, [AMAP_KEY]);

  // Update markers when locations change or map is ready
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current || !window.AMap) return;
    
    const map = mapInstanceRef.current;
    const AMap = window.AMap;
    
    // Initialize PlaceSearch
    const placeSearch = new AMap.PlaceSearch({
        pageSize: 1, // We only need the best match
        extensions: 'base',
        city: city || "", // Scope search to city if provided
    });

    console.log("TravelMap: Received locations:", locations, "City:", city);

    // Clear existing markers
    map.clearMap();

    if (locations && locations.length > 0) {
      const markers: any[] = [];
      let completedCount = 0;

      // Helper function to check if all processed
      const checkCompletion = () => {
          completedCount++;
          if (completedCount === locations.length) {
               console.log(`TravelMap: All requests finished. Success count: ${markers.length}/${locations.length}. Fitting view...`);
               if (markers.length > 0) {
                   setTimeout(() => {
                       map.setFitView(markers, false, [60, 60, 60, 60]);
                       // Fallback: center on first marker if fitView acts weirdly
                       if (markers.length > 0) {
                           // Optional: map.setCenter(markers[0].getPosition());
                       }
                   }, 500);
               }
          }
      };

      locations.forEach((locName) => {
        console.log(`TravelMap: Searching '${locName}'...`);
        
        placeSearch.search(locName, (status: string, result: any) => {
           if (status === 'complete' && result.poiList && result.poiList.pois && result.poiList.pois.length > 0) {
               const poi = result.poiList.pois[0];
               console.log(`TravelMap: Search Success for '${locName}'`, poi.location);
               
               const marker = new AMap.Marker({
                   position: poi.location,
                   title: poi.name, // Use POI name which might be more accurate
                   label: {
                     content: `<div class="text-xs bg-white border border-gray-200 rounded shadow-sm px-2 py-1 whitespace-nowrap">${locName}</div>`,
                     direction: 'top'
                   }
               });
               // Add click event to show info window or details
               marker.on('click', () => {
                   // Optional: Show more details
                   console.log("Marker clicked:", poi);
               });

               map.add(marker);
               markers.push(marker);
           } else {
               console.warn(`TravelMap: Search Failed/No Data for '${locName}'. Status: ${status}`);
           }
           checkCompletion();
        });
      });
    }
  }, [locations, isMapReady]);

  if (!AMAP_KEY) {
    return (
      <div className="w-full h-full rounded-xl overflow-hidden shadow-lg border border-gray-200 relative bg-gray-100 flex items-center justify-center">
        <div className="text-center p-4">
          <p className="text-red-600 font-bold mb-2">高德地图 Key 未配置</p>
          <p className="text-sm text-gray-600">请在 frontend/.env 文件中配置 VITE_AMAP_KEY</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-xl overflow-hidden shadow-lg border border-gray-200 relative">
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};