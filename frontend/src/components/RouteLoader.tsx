import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const RouteLoader = () => {
  const location = useLocation();

  useEffect(() => {
    NProgress.start();
    // Petite pause pour laisser le temps au DOM de changer
    const timer = setTimeout(() => {
      NProgress.done();
    }, 300);

    return () => {
      clearTimeout(timer);
      NProgress.done();
    };
  }, [location]);

  return null;
};

export default RouteLoader;