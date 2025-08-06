import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { NewHeader } from '@/components/redesign/NewHeader';

export default function TestAuth() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState('Testing authentication...');

  useEffect(() => {
    const testAuth = async () => {
      try {
        setStatus('Step 1: Calling demo auth...');
        const authResponse = await fetch('/auth/demo/google', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!authResponse.ok) {
          setStatus(`Auth failed: ${authResponse.status}`);
          return;
        }

        const authData = await authResponse.json();
        setStatus(`Step 2: Auth success. Checking user...`);

        const userResponse = await fetch('/auth/user', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!userResponse.ok) {
          setStatus(`User check failed: ${userResponse.status}`);
          return;
        }

        const userData = await userResponse.json();
        setStatus(`Step 3: User verified. Redirecting to dashboard...`);

        setTimeout(() => {
          setLocation('/dashboard');
        }, 1000);

      } catch (error) {
        setStatus(`Error: ${error}`);
      }
    };

    testAuth();
  }, [setLocation]);

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh' }}>
      <NewHeader />
      <div style={{ padding: '20px', paddingTop: '80px' }}>
        <h1>Authentication Test</h1>
        <p>{status}</p>
        <button onClick={() => setLocation('/dashboard')} style={{ padding: '10px', margin: '10px' }}>
          Go to Dashboard Directly
        </button>
        <button onClick={() => setLocation('/login')} style={{ padding: '10px', margin: '10px' }}>
          Go to Login
        </button>
      </div>
    </div>
  );
}