import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Send, TestTube } from 'lucide-react';

export default function NewsletterTest() {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isTestingWelcome, setIsTestingWelcome] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessageType('success');
        setMessage(data.message);
        setEmail('');
      } else {
        setMessageType('error');
        setMessage(data.error || 'Failed to subscribe');
      }
    } catch (error) {
      setMessageType('error');
      setMessage('Network error. Please try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleTestEmail = async () => {
    if (!email) {
      setMessageType('error');
      setMessage('Please enter an email address first');
      return;
    }
    
    setIsTesting(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/newsletter/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessageType('success');
        setMessage(data.message);
      } else {
        setMessageType('error');
        setMessage(data.error || 'Failed to send test email');
      }
    } catch (error) {
      setMessageType('error');
      setMessage('Network error. Please try again.');
    } finally {
      setIsTesting(false);
    }
  };

  const handleTestWelcome = async () => {
    if (!email) {
      setMessageType('error');
      setMessage('Please enter an email address first');
      return;
    }
    
    setIsTestingWelcome(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/newsletter/test-welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessageType('success');
        setMessage(data.message);
      } else {
        setMessageType('error');
        setMessage(data.error || 'Failed to send welcome email');
      }
    } catch (error) {
      setMessageType('error');
      setMessage('Network error. Please try again.');
    } finally {
      setIsTestingWelcome(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl text-blue-600">
              <Mail className="h-6 w-6" />
              Newsletter Subscription Test
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Test the newsletter subscription with automated welcome emails
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Main Newsletter Form */}
            <form onSubmit={handleSubscribe} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={isSubscribing}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isSubscribing ? 'Subscribing...' : 'Subscribe & Get Welcome Email'}
              </Button>
            </form>

            {/* Test Buttons */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-4">Email Testing</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button 
                  onClick={handleTestEmail}
                  disabled={isTesting}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <TestTube className="h-4 w-4" />
                  {isTesting ? 'Sending...' : 'Send Test Email'}
                </Button>
                
                <Button 
                  onClick={handleTestWelcome}
                  disabled={isTestingWelcome}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  {isTestingWelcome ? 'Sending...' : 'Send Welcome Email'}
                </Button>
              </div>
            </div>

            {/* Message Display */}
            {message && (
              <Alert className={messageType === 'success' ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}>
                <AlertDescription className={messageType === 'success' ? 'text-green-800' : 'text-red-800'}>
                  {message}
                </AlertDescription>
              </Alert>
            )}

            {/* Information */}
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
              <h4 className="font-semibold mb-2">How it works:</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>The main subscription form automatically sends a welcome email</li>
                <li>Test buttons let you verify email functionality</li>
                <li>Welcome emails include links to your latest blog posts</li>
                <li>All emails are sent using Resend service</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}