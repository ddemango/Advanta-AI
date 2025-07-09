import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { automationTemplates, type AutomationTemplate } from '@/data/automation-templates';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';
import { apiRequest } from '@/lib/queryClient';
import { NewHeader } from '@/components/redesign/NewHeader';
import Footer from '@/components/layout/Footer';
import { Helmet } from 'react-helmet';

export default function AutomationBuilder() {
  const [selectedTemplate, setSelectedTemplate] = useState<AutomationTemplate | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isActivating, setIsActivating] = useState(false);
  const { toast } = useToast();

  const uniqueCategories = automationTemplates.reduce((acc, template) => {
    if (!acc.includes(template.category)) {
      acc.push(template.category);
    }
    return acc;
  }, [] as string[]);
  const categories = ['all', ...uniqueCategories];
  
  const filteredTemplates = selectedCategory === 'all' 
    ? automationTemplates 
    : automationTemplates.filter(t => t.category === selectedCategory);

  const handleTemplateSelect = (template: AutomationTemplate) => {
    setSelectedTemplate(template);
    // Reset form data when selecting new template
    const initialData: Record<string, string> = {};
    template.fields.forEach(field => {
      initialData[field.name] = '';
    });
    setFormData(initialData);
  };

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleActivateAutomation = async () => {
    if (!selectedTemplate) return;

    // Validate required fields
    const missingFields = selectedTemplate.fields
      .filter(field => field.required && !formData[field.name])
      .map(field => field.label);

    if (missingFields.length > 0) {
      toast({
        title: "Missing Required Fields",
        description: `Please fill in: ${missingFields.join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    setIsActivating(true);
    
    try {
      const response = await apiRequest('POST', '/api/activate-automation', {
        template_id: selectedTemplate.id,
        data: formData
      });

      const result = await response.json();

      toast({
        title: "Automation Activated!",
        description: `Your "${selectedTemplate.name}" automation is now running. Scenario ID: ${result.scenario_id}`,
      });

      // Reset form
      setSelectedTemplate(null);
      setFormData({});
      
    } catch (error) {
      toast({
        title: "Activation Failed",
        description: "Unable to activate automation. Please check your credentials and try again.",
        variant: "destructive"
      });
    } finally {
      setIsActivating(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-500';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-500';
      case 'advanced': return 'bg-red-500/20 text-red-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  return (
    <>
      <Helmet>
        <title>Automation Builder - Create Custom Workflows | Advanta AI</title>
        <meta name="description" content="Build powerful automations with our visual workflow builder. Connect your favorite apps and automate repetitive tasks in minutes." />
      </Helmet>
      
      <NewHeader />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Header */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="text-center mb-12"
          >
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-4">
              Automation Builder Wizard
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-xl text-gray-300 max-w-3xl mx-auto">
              Create powerful automations by connecting your favorite apps. 
              Choose from pre-built templates and customize them with your credentials.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Template Selection */}
            <div className="lg:col-span-2">
              <motion.div variants={fadeIn} className="mb-6">
                <Label htmlFor="category" className="text-lg font-medium mb-3 block">
                  Filter by Category
                </Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {filteredTemplates.map((template) => (
                  <motion.div key={template.id} variants={fadeInUp}>
                    <Card 
                      className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
                        selectedTemplate?.id === template.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                              <i className={`${template.icon} text-primary`}></i>
                            </div>
                            <div>
                              <CardTitle className="text-lg">{template.name}</CardTitle>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {template.category}
                                </Badge>
                                <Badge className={`text-xs ${getDifficultyColor(template.difficulty)}`}>
                                  {template.difficulty}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="mb-3">
                          {template.description}
                        </CardDescription>
                        <div className="flex items-center justify-between text-sm text-gray-400">
                          <span className="flex items-center">
                            <i className="fas fa-clock mr-1"></i>
                            {template.estimatedTime}
                          </span>
                          <span className="flex items-center">
                            <i className="fas fa-cog mr-1"></i>
                            {template.fields.length} fields
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Configuration Form */}
            <div className="lg:col-span-1">
              <motion.div variants={fadeIn}>
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>
                      {selectedTemplate ? 'Configure Automation' : 'Select Template'}
                    </CardTitle>
                    <CardDescription>
                      {selectedTemplate 
                        ? 'Fill in the required fields to activate your automation'
                        : 'Choose an automation template from the left to get started'
                      }
                    </CardDescription>
                  </CardHeader>
                  
                  {selectedTemplate && (
                    <CardContent className="space-y-4">
                      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-4">
                        <h4 className="font-medium mb-2">{selectedTemplate.name}</h4>
                        <p className="text-sm text-gray-300">{selectedTemplate.description}</p>
                      </div>

                      {selectedTemplate.fields.map((field) => (
                        <div key={field.name} className="space-y-2">
                          <Label htmlFor={field.name} className="flex items-center">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </Label>
                          <Input
                            id={field.name}
                            type={field.type}
                            placeholder={field.placeholder}
                            value={formData[field.name] || ''}
                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                            required={field.required}
                          />
                        </div>
                      ))}

                      <Button 
                        onClick={handleActivateAutomation}
                        disabled={isActivating}
                        className="w-full mt-6"
                        size="lg"
                      >
                        {isActivating ? (
                          <div className="flex items-center">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Activating...
                          </div>
                        ) : (
                          <>
                            <i className="fas fa-play mr-2"></i>
                            Activate Automation
                          </>
                        )}
                      </Button>

                      <p className="text-xs text-gray-400 text-center mt-4">
                        Your automation will be created and activated on Make.com
                      </p>
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}