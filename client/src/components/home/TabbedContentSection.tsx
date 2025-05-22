import { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeIn, fadeInUp } from '@/lib/animations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Tab {
  id: string;
  label: string;
  icon?: string;
}

interface TabbedContentSectionProps {
  title: string;
  description?: string;
  tabs: Tab[];
  children: React.ReactNode;
  className?: string;
  defaultTab?: string;
}

export default function TabbedContentSection({
  title,
  description,
  tabs,
  children,
  className = '',
  defaultTab
}: TabbedContentSectionProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0].id);

  return (
    <section className={`py-16 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          {description && (
            <p className="text-lg text-muted-foreground">{description}</p>
          )}
        </motion.div>

        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:flex lg:justify-center gap-2 p-1 mb-8 bg-background/30 backdrop-blur-sm rounded-lg border border-border/40 overflow-x-auto">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="px-4 py-2 whitespace-nowrap text-sm md:text-base"
                >
                  {tab.icon && <i className={`${tab.icon} mr-2`}></i>}
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {children}
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
}