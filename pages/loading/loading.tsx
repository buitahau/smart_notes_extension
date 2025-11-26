import { useEffect } from 'react';
import { LoadingSpinner } from '@components/LoadingSpinner';
import { useMiniRouter } from '@context/router-context';
import { storage } from '@utils/storage';
import { STORAGE_KEYS } from '@utils/constants';
import './loading.css';

interface LoadingProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

export function Loading({ message = 'Smart Notes is loading...', size = 'large' }: LoadingProps) {
  const { navigate } = useMiniRouter();

  useEffect(() => {
    const checkToken = async () => {
      const token = await storage.get(STORAGE_KEYS.TOKEN);

      if (token) {
        // Token exists, navigate to home
        navigate('home');
      } else {
        // No token, navigate to login
        navigate('login');
      }
    };

    // Check token immediately for better UX
    checkToken();
  }, [navigate]);

  return (
    <div className="loading-page">
      <LoadingSpinner message={message} size={size} fullScreen={false} />
    </div>
  );
}
