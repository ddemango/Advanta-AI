import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, CreditCard, Shield, Star } from 'lucide-react';
import { useLocation } from 'wouter';
import Header from '@/components/layout/Header';
import { Helmet } from 'react-helmet';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ templateData, priceType }: { templateData: any, priceType: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success?template=${templateData.id}&type=${priceType}`,
      },
    });

    if (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "Your purchase is being processed. You'll receive access details via email.",
      });
    }

    setIsProcessing(false);
  };

  const price = priceType === 'monthly' ? templateData.monthlyPrice : templateData.price;

  return (
    <div className="min-h-screen bg-background pt-20">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Button
              variant="ghost"
              onClick={() => setLocation('/marketplace')}
              className="text-muted-foreground hover:text-foreground mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Marketplace
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                  <CardDescription>Review your purchase details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <img 
                      src={templateData.coverImage} 
                      alt={templateData.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{templateData.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary">{templateData.category}</Badge>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-muted-foreground ml-1">
                            {templateData.rating} ({templateData.reviewCount} reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">
                        {priceType === 'monthly' ? 'Monthly Subscription' : 'One-time Purchase'}
                      </span>
                      <span className="font-semibold">${price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total</span>
                      <span>${price.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-2" />
                      What's Included
                    </h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {templateData.features.slice(0, 4).map((feature: string, index: number) => (
                        <li key={index} className="flex items-center">
                          <Check className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Payment Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Payment Details
                  </CardTitle>
                  <CardDescription>
                    Secure payment powered by Stripe
                    <Shield className="w-4 h-4 inline ml-2 text-green-500" />
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email"
                          type="email" 
                          placeholder="your@email.com"
                          className="mt-1"
                          required
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          You'll receive access instructions and receipts at this email
                        </p>
                      </div>

                      <div>
                        <Label>Payment Information</Label>
                        <div className="mt-2 p-4 border rounded-lg">
                          <PaymentElement />
                        </div>
                      </div>
                    </div>

                    <Button 
                      type="submit"
                      disabled={!stripe || isProcessing}
                      className="w-full bg-primary hover:bg-primary/90"
                      size="lg"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Processing Payment...
                        </>
                      ) : (
                        <>
                          Complete Purchase - ${price.toLocaleString()}
                        </>
                      )}
                    </Button>

                    <div className="text-xs text-muted-foreground text-center space-y-1">
                      <p>By completing this purchase, you agree to our Terms of Service</p>
                      <p className="flex items-center justify-center">
                        <Shield className="w-3 h-3 mr-1" />
                        Your payment information is encrypted and secure
                      </p>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [templateData, setTemplateData] = useState<any>(null);
  const [priceType, setPriceType] = useState("one-time");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Get template and pricing info from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const templateId = urlParams.get('template');
    const type = urlParams.get('type') || 'one-time';
    
    if (!templateId) {
      toast({
        title: "Missing Template",
        description: "No template selected for checkout.",
        variant: "destructive",
      });
      return;
    }

    setPriceType(type);

    // Mock template data (in real app, fetch from API)
    const mockTemplate = {
      id: templateId,
      name: 'Enterprise Customer AI Assistant',
      price: 12999,
      monthlyPrice: 1299,
      category: 'Customer Support',
      rating: 4.9,
      reviewCount: 189,
      coverImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      features: [
        '24/7 Intelligent Support',
        '15+ Languages Support',
        'Live CRM Integration',
        'Performance Dashboard',
        'Custom Training',
        'API Integration'
      ]
    };

    setTemplateData(mockTemplate);

    // Create PaymentIntent
    apiRequest("POST", "/api/create-payment-intent", { 
      templateId,
      priceType: type,
      customerEmail: "customer@example.com" // Would get from form
    })
      .then((data) => {
        setClientSecret(data.clientSecret);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Payment setup error:', error);
        toast({
          title: "Payment Setup Error",
          description: "Failed to initialize payment. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
      });
  }, [toast]);

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Checkout - Advanta AI Marketplace</title>
        </Helmet>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Setting up your checkout...</p>
          </div>
        </div>
      </>
    );
  }

  if (!clientSecret || !templateData) {
    return (
      <>
        <Helmet>
          <title>Checkout Error - Advanta AI Marketplace</title>
        </Helmet>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Unable to load checkout. Please try again.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Checkout - {templateData.name} | Advanta AI Marketplace</title>
        <meta name="description" content={`Complete your purchase of ${templateData.name} - secure checkout powered by Stripe`} />
      </Helmet>
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutForm templateData={templateData} priceType={priceType} />
      </Elements>
    </>
  );
}