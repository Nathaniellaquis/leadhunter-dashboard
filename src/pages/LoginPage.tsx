import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { TbMail } from 'react-icons/tb';

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null); // Reset any existing errors
    try {
      await login(email, password);
      navigate('/home');
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(err?.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleGoogleLogin = async () => {
    setError(null); // Reset any existing errors
    try {
      await loginWithGoogle();
      navigate('/home');
    } catch (err: any) {
      console.error('Google login failed:', err);
      setError(err?.message || 'Google login failed. Please try again.');
    }
  };

  return (
    <div className="w-screen min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Log In</h1>
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded-md text-sm w-64 text-center">
          {error}
        </div>
      )}
      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        className="mb-2 w-64"
      />
      <Input
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        className="mb-4 w-64"
      />
      <Button onClick={handleLogin} className="mb-2 w-64">
        <TbMail className="inline-block mr-2" />
        Log In with Email
      </Button>
      <Button variant="secondary" onClick={handleGoogleLogin} className="w-64">
        <FcGoogle className="inline-block mr-2" />
        Log In with Google
      </Button>
    </div>
  );
}
