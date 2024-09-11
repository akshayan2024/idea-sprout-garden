import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuthStore } from '../store/authStore';
import { toast } from 'sonner';
import { GoogleLogin } from '@react-oauth/google';

const AuthForm = () => {
  const { login } = useAuthStore();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await login(credentialResponse);
      toast.success('Logged in successfully!');
    } catch (error) {
      console.error('Auth error:', error);
      toast.error('Authentication failed. Please try again.');
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Login / Sign Up</h2>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => {
          toast.error('Login Failed');
        }}
      />
    </Card>
  );
};

export default AuthForm;