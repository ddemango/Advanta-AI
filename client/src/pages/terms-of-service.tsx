import { Helmet } from 'react-helmet';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Mail, MapPin } from 'lucide-react';

export default function TermsOfService() {
  return (
    <>
      <Helmet>
        <title>Terms of Service | Advanta AI</title>
        <meta name="description" content="Read our terms of service to understand your rights and responsibilities when using Advanta AI services." />
        <meta property="og:title" content="Terms of Service | Advanta AI" />
        <meta property="og:description" content="Legal terms and conditions for using Advanta AI platform and services." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-4">Terms of Service</h1>
              <p className="text-lg text-muted-foreground">
                Effective Date: June 3, 2025 • Website: https://www.advanta-ai.com
              </p>
            </div>

            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>1. Agreement</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    By using our site or services, you agree to be bound by these Terms and our Privacy Policy. If not, please stop using our platform.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>2. User Account & Access</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    You may use Google OAuth to create an account. You're responsible for maintaining the confidentiality and security of your credentials.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>3. Use of Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    You agree to use our platform only for legal and authorized purposes and not to misuse or disrupt service functionality.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>4. IP Ownership</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    All content (UI, code, text, media) is owned by Advanta AI or licensed to us. You may not reproduce or repurpose it without consent.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>5. Suspension or Termination</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We reserve the right to suspend or terminate your account if you violate these terms or act maliciously.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>6. Liability Disclaimer</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We provide our services "as is." We are not responsible for downtime, bugs, or data loss. Our liability is limited to the maximum extent permitted by law.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>7. Legal Jurisdiction</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    These terms are governed by the laws of Tennessee, United States. Disputes shall be resolved in that jurisdiction.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>8. Updates</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We may update these Terms and will notify you by posting changes. Continued use after updates implies consent.
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