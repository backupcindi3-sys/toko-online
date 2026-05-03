import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

export default function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    // Only track if tracking ID is set and ReactGA is initialized
    if (import.meta.env.VITE_GA_TRACKING_ID) {
      ReactGA.send({ hitType: 'pageview', page: location.pathname + location.search });
    }
  }, [location]);

  return null;
}
