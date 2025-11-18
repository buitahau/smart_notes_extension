import { useMiniRouter } from '@context/router-context';
import { STORAGE_KEYS } from '@utils/constants';
import { storage } from '@utils/storage';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@components/LoadingSpinner';

export function RequiredAuth({ children }: { children: React.ReactNode }) {
  const { navigate } = useMiniRouter();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    async function validateToken() {
      const token = await storage.get(STORAGE_KEYS.TOKEN);
      if (!token) {
        navigate('login');
        return;
      }
      setIsValidating(false);
    }
    validateToken();
  }, [navigate]);

  if (isValidating) {
    return <LoadingSpinner message="Validating session..." size="small" />;
  }

  return <>{children}</>;
}
