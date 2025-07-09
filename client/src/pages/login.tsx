import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Helmet } from 'react-helmet';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  ArrowRight, 
  Shield,
  CheckCircle,
  Sparkles,
  X
} from 'lucide-react';

export default function Login() {
  const [, setLocation] = useLocation();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState<string | null>(null);

  // Check if user is already authenticated
  useEffect(() => {
    fetch('/auth/user')
      .then(res => res.json())
      .then(user => {
        if (user) {
          setLocation('/dashboard');
        }
      })
      .catch(() => {
        // User not authenticated, stay on login page
      });
  }, [setLocation]);

  const handleGoogleLogin = () => {
    // Redirect to Google OAuth endpoint
    window.location.href = '/auth/google';
  };

  const handleAppleLogin = async () => {
    try {
      const response = await fetch('/auth/demo/apple', {
        method: 'GET', 
        credentials: 'include'
      });
      
      if (response.ok) {
        setLocation('/dashboard');
      } else {
        setError('Apple login failed. Please try again.');
      }
    } catch (error) {
      console.error('Apple login error:', error);
      setError('Apple login failed. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const endpoint = isSignUp ? '/auth/signup' : '/auth/login';
      const body = isSignUp 
        ? { name, email, password, confirmPassword }
        : { email, password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        setLocation('/dashboard');
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotPasswordLoading(true);
    setForgotPasswordMessage(null);

    try {
      const response = await fetch('/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setForgotPasswordMessage(data.message);
      } else {
        setForgotPasswordMessage(data.message || 'Failed to send reset email');
      }
    } catch (error) {
      setForgotPasswordMessage('Network error. Please try again.');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{isSignUp ? 'Sign Up' : 'Sign In'} | Advanta AI</title>
        <meta name="description" content="Sign in to your Advanta AI workspace and access powerful AI automation tools." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Desktop: Two-panel layout */}
        <div className="hidden lg:flex min-h-screen">
          {/* Left Panel - Brand & Message */}
          <div className="flex-1 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center p-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-lg text-white"
            >
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">Advanta AI</span>
              </div>
              
              <h1 className="text-4xl font-bold mb-6 leading-tight">
                Welcome back to your AI workspace
              </h1>
              
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Sign in to streamline your next breakthrough with intelligent automation and custom AI solutions.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                  <span className="text-blue-100">Advanced AI workflows at your fingertips</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                  <span className="text-blue-100">Enterprise-grade security and privacy</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                  <span className="text-blue-100">Real-time collaboration and insights</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Panel - Login Form */}
          <div className="flex-1 flex items-center justify-center p-12">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full max-w-md"
            >
              <LoginForm 
                isSignUp={isSignUp}
                setIsSignUp={setIsSignUp}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                name={name}
                setName={setName}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                showConfirmPassword={showConfirmPassword}
                setShowConfirmPassword={setShowConfirmPassword}
                isLoading={isLoading}
                error={error}
                handleSubmit={handleSubmit}
                handleGoogleLogin={handleGoogleLogin}
                handleAppleLogin={handleAppleLogin}
                showForgotPassword={showForgotPassword}
                setShowForgotPassword={setShowForgotPassword}
                forgotPasswordEmail={forgotPasswordEmail}
                setForgotPasswordEmail={setForgotPasswordEmail}
                forgotPasswordLoading={forgotPasswordLoading}
                forgotPasswordMessage={forgotPasswordMessage}
                handleForgotPassword={handleForgotPassword}
              />
            </motion.div>
          </div>
        </div>

        {/* Mobile: Single column layout */}
        <div className="lg:hidden min-h-screen flex flex-col">
          {/* Mobile Header */}
          <div className="pt-8 pb-6 px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-center space-x-3 mb-4"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">Advanta AI</span>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-600"
            >
              Welcome back to your AI workspace
            </motion.p>
          </div>

          {/* Mobile Form */}
          <div className="flex-1 px-4 pb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <LoginForm 
                isSignUp={isSignUp}
                setIsSignUp={setIsSignUp}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                name={name}
                setName={setName}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                showConfirmPassword={showConfirmPassword}
                setShowConfirmPassword={setShowConfirmPassword}
                isLoading={isLoading}
                error={error}
                handleSubmit={handleSubmit}
                handleGoogleLogin={handleGoogleLogin}
                handleAppleLogin={handleAppleLogin}
                showForgotPassword={showForgotPassword}
                setShowForgotPassword={setShowForgotPassword}
                forgotPasswordEmail={forgotPasswordEmail}
                setForgotPasswordEmail={setForgotPasswordEmail}
                forgotPasswordLoading={forgotPasswordLoading}
                forgotPasswordMessage={forgotPasswordMessage}
                handleForgotPassword={handleForgotPassword}
                isMobile={true}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}

interface LoginFormProps {
  isSignUp: boolean;
  setIsSignUp: (value: boolean) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  name: string;
  setName: (value: string) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (value: boolean) => void;
  isLoading: boolean;
  error: string | null;
  handleSubmit: (e: React.FormEvent) => void;
  handleGoogleLogin: () => void;
  handleAppleLogin: () => void;
  showForgotPassword: boolean;
  setShowForgotPassword: (value: boolean) => void;
  forgotPasswordEmail: string;
  setForgotPasswordEmail: (value: string) => void;
  forgotPasswordLoading: boolean;
  forgotPasswordMessage: string | null;
  handleForgotPassword: (e: React.FormEvent) => void;
  isMobile?: boolean;
}

function LoginForm({
  isSignUp,
  setIsSignUp,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  name,
  setName,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  isLoading,
  error,
  handleSubmit,
  handleGoogleLogin,
  handleAppleLogin,
  showForgotPassword,
  setShowForgotPassword,
  forgotPasswordEmail,
  setForgotPasswordEmail,
  forgotPasswordLoading,
  forgotPasswordMessage,
  handleForgotPassword,
  isMobile = false
}: LoginFormProps) {
  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {isSignUp ? 'Create your account' : 'Sign in to continue'}
        </h2>
        <p className="text-gray-600">
          {isSignUp 
            ? 'Get started with Advanta AI today' 
            : 'Access your AI automation workspace'
          }
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700"
        >
          {error}
        </motion.div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {isSignUp && (
          <div>
            <Label htmlFor="name" className="text-gray-700 font-medium">
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 h-12 px-4 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter your full name"
              required={isSignUp}
              autoFocus={isSignUp}
              aria-invalid={error ? 'true' : 'false'}
            />
          </div>
        )}

        <div>
          <Label htmlFor="email" className="text-gray-700 font-medium">
            Email Address
          </Label>
          <div className="relative mt-2">
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 pl-12 pr-4 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter your email"
              required
              autoFocus={!isSignUp}
              aria-invalid={error ? 'true' : 'false'}
            />
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div>
          <Label htmlFor="password" className="text-gray-700 font-medium">
            Password
          </Label>
          <div className="relative mt-2">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 pl-12 pr-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter your password"
              required
              aria-invalid={error ? 'true' : 'false'}
            />
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {isSignUp && (
          <div>
            <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
              Confirm Password
            </Label>
            <div className="relative mt-2">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-12 pl-12 pr-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Confirm your password"
                required={isSignUp}
                aria-invalid={error ? 'true' : 'false'}
              />
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        )}

        {!isSignUp && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Forgot password?
            </button>
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="my-8 flex items-center">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="px-4 text-gray-500 text-sm">or</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      {/* Social Login */}
      <div className="space-y-3">
        <Button
          onClick={handleGoogleLogin}
          variant="outline"
          className="w-full h-12 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
        >
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </Button>

        <Button
          onClick={handleAppleLogin}
          variant="outline"
          className="w-full h-12 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
        >
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
          Continue with Apple
        </Button>
      </div>

      {/* Security Badge */}
      <div className="mt-8 flex items-center justify-center space-x-2 text-gray-500 text-sm">
        <Shield className="w-4 h-4" />
        <span>Your login is secure & encrypted</span>
      </div>

      {/* Sign Up / Sign In Toggle */}
      <div className="mt-8 text-center">
        <span className="text-gray-600">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
        </span>
        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="ml-2 text-blue-600 hover:text-blue-700 font-semibold"
        >
          {isSignUp ? 'Sign in' : 'Sign up'}
        </button>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Reset Password</h3>
              <button
                onClick={() => setShowForgotPassword(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-gray-600 mb-6">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            {forgotPasswordMessage && (
              <div className={`mb-4 p-3 rounded-lg text-sm ${
                forgotPasswordMessage.includes('error') || forgotPasswordMessage.includes('failed') 
                  ? 'bg-red-50 text-red-700 border border-red-200' 
                  : 'bg-green-50 text-green-700 border border-green-200'
              }`}>
                {forgotPasswordMessage}
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <Label htmlFor="forgotEmail" className="text-gray-700 font-medium">
                  Email Address
                </Label>
                <div className="relative mt-2">
                  <Input
                    id="forgotEmail"
                    type="email"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    className="h-12 pl-12 pr-4 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter your email"
                    required
                    autoFocus
                  />
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  variant="outline"
                  className="flex-1 h-12"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={forgotPasswordLoading}
                  className="flex-1 h-12 bg-blue-600 hover:bg-blue-700"
                >
                  {forgotPasswordLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}