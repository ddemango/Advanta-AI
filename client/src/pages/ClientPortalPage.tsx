import { Helmet } from 'react-helmet';
import { NewHeader } from '@/components/redesign/NewHeader';
import ClientPortal from '@/components/portal/ClientPortal';

export default function ClientPortalPage() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Client Portal - Advanta AI</title>
        <meta name="description" content="Access your AI automation dashboard, analytics, and management tools." />
      </Helmet>
      
      <NewHeader />
      
      <main className="pt-20">
        <ClientPortal />
      </main>
    </div>
  );
}