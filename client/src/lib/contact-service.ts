import { apiRequest } from '@/lib/queryClient';

interface ContactFormData {
  name: string;
  email: string;
  company: string;
  industry: string;
  message: string;
  consent: boolean;
}

/**
 * Sends contact form data to the server
 */
export async function sendContactForm(formData: ContactFormData): Promise<void> {
  const response = await apiRequest('POST', '/api/contact', formData);
  if (!response.ok) {
    throw new Error('Failed to send contact form');
  }
}
