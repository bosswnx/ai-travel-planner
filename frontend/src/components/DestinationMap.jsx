import { useEffect, useRef, useState } from 'react';

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
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${key}`;
    script.async = true;
    script.onload = () => resolve(window.AMap);
    script.onerror = () => reject(new Error('加载高德地图失败'));
    document.body.appendChild(script);
  });

const DestinationMap = ({ destination }) => {
  const containerRef = useRef(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
  }, [destination]);

  useEffect(() => {
    if (!destination) return;

    const key = import.meta.env.VITE_AMAP_KEY;
    loadAmap(key)
      .then((AMap) => {
        if (!containerRef.current) return;
        const map = new AMap.Map(containerRef.current, {
          zoom: 12,
          viewMode: '3D',
        });
        AMap.plugin('AMap.PlaceSearch', () => {
          const placeSearch = new AMap.PlaceSearch({
            pageSize: 1,
          });
          placeSearch.search(destination, (status, result) => {
            if (status === 'complete' && result.poiList?.pois?.length) {
              const poi = result.poiList.pois[0];
              map.setCenter(poi.location);
              map.setZoom(12);
              new AMap.Marker({
                position: poi.location,
                map,
                title: poi.name,
              });
            } else {
              setError('未找到相关地点，请调整关键词。');
            }
          });
        });
      })
      .catch((error) => {
        setError(error.message);
      });
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
