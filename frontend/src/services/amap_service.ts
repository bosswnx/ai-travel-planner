
const AMAP_KEY = import.meta.env.VITE_AMAP_KEY || "";
const SECURITY_CODE = import.meta.env.VITE_AMAP_SECURITY_CODE || "";

// Inject security code global
if (typeof window !== 'undefined' && SECURITY_CODE) {
    // @ts-ignore
    window._AMapSecurityConfig = {
        securityJsCode: SECURITY_CODE,
    };
}

interface GeocodeResult {
    status: 'success' | 'fail';
    message?: string;
    longitude?: number;
    latitude?: number;
}

/**
 * Geocodes an address string to its latitude and longitude coordinates using Gaode Maps (AMap).
 * @param address The address string to geocode.
 * @returns A Promise that resolves to an object containing status, message (if error), longitude, and latitude.
 */
export const geocodeAddress = async (address: string): Promise<GeocodeResult> => {
    return new Promise((resolve) => {
        if (!AMAP_KEY) {
            return resolve({ status: 'fail', message: 'AMap Key is not configured.' });
        }
        if (!window.AMap) {
            return resolve({ status: 'fail', message: 'AMap object is not initialized. Map script might not be loaded yet.' });
        }

        window.AMap.plugin('AMap.Geocoder', () => {
            const geocoder = new window.AMap.Geocoder({
                // city: '全国', // city to be set according to actual needs
                radius: 1000 // search radius
            });

            geocoder.getLocation(address, (status: string, result: any) => {
                if (status === 'complete' && result.info === 'OK') {
                    const geocode = result.geocodes[0];
                    if (geocode) {
                        resolve({
                            status: 'success',
                            longitude: parseFloat(geocode.location.lng),
                            latitude: parseFloat(geocode.location.lat)
                        });
                    } else {
                        resolve({ status: 'fail', message: 'No geocode found for the address.' });
                    }
                } else {
                    resolve({ status: 'fail', message: `Geocoding failed: ${result.info}` });
                }
            });
        });
    });
};
