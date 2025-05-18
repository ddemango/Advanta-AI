import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import Services from '@/components/home/Services';
import CaseStudies from '@/components/home/CaseStudies';
import AiAssessment from '@/components/home/AiAssessment';
import Testimonials from '@/components/home/Testimonials';
import AiDemo from '@/components/home/AiDemo';
import Contact from '@/components/home/Contact';
import { Helmet } from 'react-helmet';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Advanta AI - Engineering the Future of Intelligence</title>
        <meta name="description" content="Advanta AI delivers custom AI solutions, machine learning development, and industry-specific AI applications to transform your business." />
        <meta name="keywords" content="AI-powered business solutions, custom machine learning development, industry-specific AI applications, AI consulting services" />
        <meta property="og:title" content="Advanta AI - Engineering the Future of Intelligence" />
        <meta property="og:description" content="Advanta AI delivers custom AI solutions, machine learning development, and industry-specific AI applications to transform your business." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <Header />
      
      <main>
        <Hero />
        <Services />
        <CaseStudies />
        <AiAssessment />
        <Testimonials />
        <AiDemo />
        <Contact />
      </main>
      
      <Footer />
    </>
  );
}
