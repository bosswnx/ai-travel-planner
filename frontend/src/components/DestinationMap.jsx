import { useEffect, useRef, useState } from 'react';
import { appConfig } from '../config.js';

const scriptId = 'amap-sdk';

const loadAmap = (key) =>
  new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('window is undefined'));
      return;
    }

    if (window.AMap) {
      resolve(window.AMap);
      return;
    }

    if (!key) {
      reject(new Error('缺少高德地图 Key'));
      return;
    }

    if (document.getElementById(scriptId)) {
      document.getElementById(scriptId).addEventListener('load', () => resolve(window.AMap));
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${key}&plugin=AMap.Geocoder,AMap.PlaceSearch`;
    script.async = true;
    script.onload = () => resolve(window.AMap);
    script.onerror = () => reject(new Error('加载高德地图失败'));
    document.body.appendChild(script);
  });

const DestinationMap = ({ destination }) => {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
  }, [destination]);

  useEffect(() => {
    if (!destination) return;

    if (!appConfig.amapKey) {
      setError('缺少高德地图 Key');
      return;
    }

    loadAmap(appConfig.amapKey)
      .then((AMap) => {
        if (!containerRef.current) return;
        mapRef.current?.destroy?.();

        const map = new AMap.Map(containerRef.current, {
          zoom: 10,
          viewMode: '3D',
        });

        mapRef.current = map;

        AMap.plugin(['AMap.Geocoder', 'AMap.PlaceSearch'], () => {
          const geocoder = new AMap.Geocoder({ city: '全国' });
          geocoder.getLocation(destination, (status, result) => {
            if (status !== 'complete' || !result?.geocodes?.length) {
              setError('未找到相关地点，请调整关键词。');
              return;
            }

            const location = result.geocodes[0].location;
            const position = [location.lng, location.lat];

            map.setCenter(position);
            map.setZoom(12);

            setError('');

            new AMap.Marker({
              position,
              map,
              title: result.geocodes[0].formattedAddress || destination,
            });
          });
        });
      })
      .catch((error) => {
        setError(error.message);
      });

    return () => {
      mapRef.current?.destroy?.();
      mapRef.current = null;
    };
  }, [destination]);

  return (
    <div className="relative">
      <div ref={containerRef} className="h-64 w-full rounded-2xl border border-slate-800" />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl border border-slate-800 bg-slate-950/80 text-sm text-rose-300">
          {error}
        </div>
      )}
    </div>
  );
};

export default DestinationMap;
