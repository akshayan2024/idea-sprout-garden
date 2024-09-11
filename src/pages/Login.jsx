import React from 'react';
import { Card } from "@/components/ui/card";
import { useAuthStore } from '../store/authStore';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Login = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await login(credentialResponse);
      toast.success('Logged in successfully!');
      navigate('/');
    } catch (error) {
      console.error('Auth error:', error);
      toast.error('Authentication failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center">
      <Card className="p-8 bg-brand-medium border-brand-accent">
        <h1 className="text-3xl font-bold mb-6 text-center text-brand-accent">Login to Idea Sprout Garden</h1>
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              toast.error('Login Failed');
            }}
          />
        </div>
      </Card>
    </div>
  );
};

export default Login;