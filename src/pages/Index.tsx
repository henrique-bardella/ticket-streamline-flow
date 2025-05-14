
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/'); // Navigate to home if already authenticated
    } else {
      navigate('/login'); // Navigate to login if not authenticated
    }
  }, [isAuthenticated, navigate]);

  return null;
};

export default Index;
