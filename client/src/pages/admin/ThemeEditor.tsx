import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { defaultThemes, applyTheme, type ThemeConfig } from '@/lib/themes';
import { Upload, Save, Eye, Copy } from 'lucide-react';

// Admin theme and content editor for multi-tenant system

interface TenantConfig {
  id: number;
  slug: string;
  name: string;
  logoUrl?: string;
  themeId: string;
  page: {
    hero: {
      title: string;
      subtitle: string;
      cta: string;
    };
    features: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
  };
}

export default function ThemeEditor() {
  const [selectedTenant, setSelectedTenant] = useState<string>('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch tenants list
  const { data: tenants } = useQuery({
    queryKey: ['/api/admin/tenants'],
  });

  // Fetch selected tenant config
  const { data: tenantConfig, isLoading } = useQuery<TenantConfig>({
    queryKey: ['/api/admin/tenants', selectedTenant],
    enabled: !!selectedTenant,
  });

  // Update tenant mutation
  const updateTenantMutation = useMutation({
    mutationFn: async (config: Partial<TenantConfig>) => {
      const response = await fetch(`/api/admin/tenants/${selectedTenant}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (!response.ok) throw new Error('Failed to update tenant');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: 'Tenant updated successfully' });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/tenants'] });
    },
    onError: (error) => {
      toast({ 
        title: 'Update failed', 
        description: error.message,
        variant: 'destructive' 
      });
    },
  });

  // Upload logo mutation
  const uploadLogoMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('logo', file);
      formData.append('tenantId', selectedTenant);
      
      const response = await fetch('/api/admin/upload-logo', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to upload logo');
      return response.json();
    },
    onSuccess: (data) => {
      toast({ title: 'Logo uploaded successfully' });
      if (tenantConfig) {
        updateTenantMutation.mutate({ logoUrl: data.logoUrl });
      }
    },
  });

  const handleSave = () => {
    if (tenantConfig) {
      updateTenantMutation.mutate(tenantConfig);
    }
  };

  const handleLogoUpload = () => {
    if (logoFile) {
      uploadLogoMutation.mutate(logoFile);
    }
  };

  const handleThemePreview = (themeId: string) => {
    const theme = defaultThemes[themeId];
    if (theme) {
      applyTheme(theme);
      setPreviewMode(true);
      setTimeout(() => {
        setPreviewMode(false);
        // Reset to original theme
        applyTheme(defaultThemes['modern-blue']);
      }, 5000);
    }
  };

  if (!tenantConfig && selectedTenant) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading tenant configuration...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Theme & Content Editor</h1>
        {previewMode && (
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
            Preview Mode Active (5s)
          </div>
        )}
      </div>

      {/* Tenant Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Tenant</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedTenant} onValueChange={setSelectedTenant}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a tenant to edit" />
            </SelectTrigger>
            <SelectContent>
              {tenants?.map((tenant: any) => (
                <SelectItem key={tenant.slug} value={tenant.slug}>
                  {tenant.name} ({tenant.slug})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {tenantConfig && (
        <>
          {/* Logo Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Logo & Branding</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                {tenantConfig.logoUrl && (
                  <img 
                    src={tenantConfig.logoUrl} 
                    alt="Current logo"
                    className="h-12 w-12 object-cover rounded border"
                  />
                )}
                <div className="flex-1 space-y-2">
                  <Label htmlFor="logo">Upload New Logo</Label>
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                  />
                </div>
                <Button 
                  onClick={handleLogoUpload} 
                  disabled={!logoFile || uploadLogoMutation.isPending}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Theme Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Theme Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {Object.entries(defaultThemes).map(([themeId, theme]) => (
                  <div
                    key={themeId}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      tenantConfig.themeId === themeId 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      setSelectedTenant(prev => ({
                        ...tenantConfig,
                        themeId
                      } as any));
                    }}
                  >
                    <div 
                      className="h-16 rounded mb-3"
                      style={{ background: theme.gradients.primary }}
                    ></div>
                    <h3 className="font-semibold capitalize">
                      {themeId.replace('-', ' ')}
                    </h3>
                    <div className="flex justify-between mt-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleThemePreview(themeId);
                        }}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Preview
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Content Editing */}
          <Card>
            <CardHeader>
              <CardTitle>Page Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Hero Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Hero Section</h3>
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="hero-title">Title</Label>
                    <Input
                      id="hero-title"
                      value={tenantConfig.page.hero.title}
                      onChange={(e) => setSelectedTenant({
                        ...tenantConfig,
                        page: {
                          ...tenantConfig.page,
                          hero: {
                            ...tenantConfig.page.hero,
                            title: e.target.value
                          }
                        }
                      } as any)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="hero-subtitle">Subtitle</Label>
                    <Textarea
                      id="hero-subtitle"
                      value={tenantConfig.page.hero.subtitle}
                      onChange={(e) => setSelectedTenant({
                        ...tenantConfig,
                        page: {
                          ...tenantConfig.page,
                          hero: {
                            ...tenantConfig.page.hero,
                            subtitle: e.target.value
                          }
                        }
                      } as any)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="hero-cta">Call to Action</Label>
                    <Input
                      id="hero-cta"
                      value={tenantConfig.page.hero.cta}
                      onChange={(e) => setSelectedTenant({
                        ...tenantConfig,
                        page: {
                          ...tenantConfig.page,
                          hero: {
                            ...tenantConfig.page.hero,
                            cta: e.target.value
                          }
                        }
                      } as any)}
                    />
                  </div>
                </div>
              </div>

              {/* Features Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Features</h3>
                {tenantConfig.page.features.map((feature, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Feature {index + 1}</h4>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label>Icon (emoji)</Label>
                        <Input
                          value={feature.icon}
                          onChange={(e) => {
                            const updatedFeatures = [...tenantConfig.page.features];
                            updatedFeatures[index] = { ...feature, icon: e.target.value };
                            setSelectedTenant({
                              ...tenantConfig,
                              page: {
                                ...tenantConfig.page,
                                features: updatedFeatures
                              }
                            } as any);
                          }}
                        />
                      </div>
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={feature.title}
                          onChange={(e) => {
                            const updatedFeatures = [...tenantConfig.page.features];
                            updatedFeatures[index] = { ...feature, title: e.target.value };
                            setSelectedTenant({
                              ...tenantConfig,
                              page: {
                                ...tenantConfig.page,
                                features: updatedFeatures
                              }
                            } as any);
                          }}
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={feature.description}
                          onChange={(e) => {
                            const updatedFeatures = [...tenantConfig.page.features];
                            updatedFeatures[index] = { ...feature, description: e.target.value };
                            setSelectedTenant({
                              ...tenantConfig,
                              page: {
                                ...tenantConfig.page,
                                features: updatedFeatures
                              }
                            } as any);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Save Actions */}
          <div className="flex justify-end space-x-4">
            <Button 
              variant="outline"
              onClick={() => window.open(`/tenant/${tenantConfig.slug}`, '_blank')}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview Site
            </Button>
            <Button onClick={handleSave} disabled={updateTenantMutation.isPending}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </>
      )}
    </div>
  );
}