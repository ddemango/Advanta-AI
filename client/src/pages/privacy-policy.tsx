import { Helmet } from 'react-helmet';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Mail, MapPin } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Advanta AI</title>
        <meta name="description" content="Learn how Advanta AI protects your privacy and handles your personal information when you use our services." />
        <meta property="og:title" content="Privacy Policy | Advanta AI" />
        <meta property="og:description" content="Comprehensive privacy policy outlining how we collect, use, and protect your data." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
              <p className="text-lg text-muted-foreground">
                Effective Date: June 3, 2025 • Website: https://www.advanta-ai.com
              </p>
            </div>

            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>1. Introduction</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Advanta AI ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services, including when you authenticate via Google OAuth.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>2. Information We Collect</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    When you use Google OAuth to access our services, we may collect:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li><strong>Personal Information:</strong> Your name, email address, and profile picture via Google.</li>
                    <li><strong>OAuth Permissions:</strong> Any scopes/permissions you grant during sign-in.</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>3. How We Use Your Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">We use your information to:</p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Authenticate and provide access to your account.</li>
                    <li>Personalize your experience.</li>
                    <li>Communicate system or feature updates.</li>
                    <li>Ensure legal compliance and system security.</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>4. Sharing and Disclosure</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    We never sell or rent your data. We may share it with:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Vetted service providers (hosting, analytics).</li>
                    <li>Legal authorities when required by law.</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>5. Data Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We follow industry best practices to secure your data. No method is 100% secure, but we use encryption, access control, and secure servers to reduce risk.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>6. Retention</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We retain data only as long as necessary to fulfill service and legal requirements. You can request deletion at any time.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>7. Your Rights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Depending on your location, you may:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Access, correct, or delete your data.</li>
                    <li>Object to or restrict processing.</li>
                    <li>Request data portability.</li>
                    <li>Contact us to exercise these rights.</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>8. Changes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We may update this policy. You'll find changes posted on this page with a new effective date.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>9. Contact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-primary font-semibold">Advanta AI</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Tennessee, United States</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">contact@advanta-ai.com</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}