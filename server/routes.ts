import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBlogPostSchema, insertResourceSchema } from "@shared/schema";

interface ContactFormData {
  name: string;
  email: string;
  company: string;
  industry: string;
  message: string;
  consent: boolean;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // API route for contact form submissions
  app.post('/api/contact', async (req, res) => {
    try {
      const formData: ContactFormData = req.body;
      
      // Basic validation
      if (!formData.name || !formData.email || !formData.message) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      
      if (!formData.consent) {
        return res.status(400).json({ message: 'Consent is required' });
      }
      
      // Here you would typically save to database or send an email
      // For now, we'll just log the submission and return success
      console.log('Contact form submission:', formData);
      
      // Return success response
      return res.status(200).json({ 
        message: 'Contact form submitted successfully',
        success: true
      });
    } catch (error) {
      console.error('Error processing contact form:', error);
      return res.status(500).json({ message: 'Server error processing your request' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
