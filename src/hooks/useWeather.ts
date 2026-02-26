import { useState, useEffect } from 'react';

interface WeatherData {
  temp: number;
  humidity: number;
  loading: boolean;
  error: string | null;
}

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData>({
    temp: 0,
    humidity: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setWeather(prev => ({ ...prev, loading: false, error: 'Geolocation not supported' }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Using Open-Meteo API (free, no key required for low volume)
          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m`
          );
          
          if (!response.ok) throw new Error('Weather fetch failed');
          
          const data = await response.json();
          setWeather({
            temp: data.current.temperature_2m,
            humidity: data.current.relative_humidity_2m,
            loading: false,
            error: null,
          });
        } catch (err) {
          setWeather(prev => ({ ...prev, loading: false, error: 'Failed to fetch weather' }));
        }
      },
      (err) => {
        setWeather(prev => ({ ...prev, loading: false, error: err.message }));
      }
    );
  }, []);

  return weather;
}
