export interface AutomationField {
  label: string;
  name: string;
  type: 'text' | 'email' | 'url' | 'password' | 'number';
  placeholder?: string;
  required?: boolean;
}

export interface AutomationTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  make_scenario_id: string;
  fields: AutomationField[];
  icon: string;
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export const automationTemplates: AutomationTemplate[] = [
  {
    id: "email_to_notion",
    name: "Email → Notion",
    description: "Automatically send emails with specific labels to your Notion database for organized tracking.",
    category: "Productivity",
    make_scenario_id: "abc12345",
    icon: "fas fa-envelope",
    estimatedTime: "5 minutes",
    difficulty: "beginner",
    fields: [
      { 
        label: "Notion Integration Token", 
        name: "notion_token", 
        type: "password",
        placeholder: "secret_xxxxxxxxxxxxx",
        required: true
      },
      { 
        label: "Notion Database ID", 
        name: "database_id", 
        type: "text",
        placeholder: "32-character database ID",
        required: true
      },
      { 
        label: "Email Filter (Sender)", 
        name: "sender_email", 
        type: "email",
        placeholder: "notifications@company.com",
        required: false
      }
    ]
  },
  {
    id: "shopify_to_sheets",
    name: "New Order → Google Sheet",
    description: "Track all new Shopify orders in a Google Sheet for easy analysis and reporting.",
    category: "E-commerce",
    make_scenario_id: "xyz789",
    icon: "fas fa-shopping-cart",
    estimatedTime: "8 minutes",
    difficulty: "intermediate",
    fields: [
      { 
        label: "Shopify Store URL", 
        name: "shopify_store", 
        type: "url",
        placeholder: "your-store.myshopify.com",
        required: true
      },
      { 
        label: "Shopify Admin API Key", 
        name: "shopify_key", 
        type: "password",
        placeholder: "shpat_xxxxxxxxxxxxx",
        required: true
      },
      { 
        label: "Google Sheet ID", 
        name: "sheet_id", 
        type: "text",
        placeholder: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
        required: true
      }
    ]
  },
  {
    id: "slack_to_airtable",
    name: "Slack Messages → Airtable",
    description: "Save important Slack messages and mentions to an Airtable base for follow-up tracking.",
    category: "Team Collaboration",
    make_scenario_id: "def456",
    icon: "fab fa-slack",
    estimatedTime: "6 minutes",
    difficulty: "beginner",
    fields: [
      { 
        label: "Slack Bot Token", 
        name: "slack_token", 
        type: "password",
        placeholder: "xoxb-xxxxxxxxxxxxx",
        required: true
      },
      { 
        label: "Slack Channel ID", 
        name: "channel_id", 
        type: "text",
        placeholder: "C1234567890",
        required: true
      },
      { 
        label: "Airtable API Key", 
        name: "airtable_key", 
        type: "password",
        placeholder: "keyxxxxxxxxxxxxx",
        required: true
      },
      { 
        label: "Airtable Base ID", 
        name: "base_id", 
        type: "text",
        placeholder: "appxxxxxxxxxxxxx",
        required: true
      }
    ]
  },
  {
    id: "typeform_to_hubspot",
    name: "Typeform → HubSpot CRM",
    description: "Automatically create HubSpot contacts from Typeform submissions for seamless lead management.",
    category: "Lead Generation",
    make_scenario_id: "ghi789",
    icon: "fas fa-user-plus",
    estimatedTime: "10 minutes",
    difficulty: "advanced",
    fields: [
      { 
        label: "Typeform API Token", 
        name: "typeform_token", 
        type: "password",
        placeholder: "tfp_xxxxxxxxxxxxx",
        required: true
      },
      { 
        label: "Typeform Form ID", 
        name: "form_id", 
        type: "text",
        placeholder: "abc12345",
        required: true
      },
      { 
        label: "HubSpot API Key", 
        name: "hubspot_key", 
        type: "password",
        placeholder: "pat-na1-xxxxxxxxxxxxx",
        required: true
      }
    ]
  },
  {
    id: "calendar_to_slack",
    name: "Calendar Events → Slack",
    description: "Send daily agenda summaries and meeting reminders to your team's Slack channel.",
    category: "Team Collaboration",
    make_scenario_id: "jkl012",
    icon: "fas fa-calendar",
    estimatedTime: "7 minutes",
    difficulty: "intermediate",
    fields: [
      { 
        label: "Google Calendar ID", 
        name: "calendar_id", 
        type: "email",
        placeholder: "your-email@gmail.com",
        required: true
      },
      { 
        label: "Google API Key", 
        name: "google_key", 
        type: "password",
        placeholder: "AIzaSyxxxxxxxxxxxxx",
        required: true
      },
      { 
        label: "Slack Webhook URL", 
        name: "slack_webhook", 
        type: "url",
        placeholder: "https://hooks.slack.com/services/...",
        required: true
      }
    ]
  },
  {
    id: "stripe_to_discord",
    name: "Stripe Payments → Discord",
    description: "Get instant Discord notifications for new payments and subscription changes.",
    category: "Finance",
    make_scenario_id: "mno345",
    icon: "fab fa-stripe",
    estimatedTime: "5 minutes",
    difficulty: "beginner",
    fields: [
      { 
        label: "Stripe Webhook Secret", 
        name: "stripe_secret", 
        type: "password",
        placeholder: "whsec_xxxxxxxxxxxxx",
        required: true
      },
      { 
        label: "Discord Webhook URL", 
        name: "discord_webhook", 
        type: "url",
        placeholder: "https://discord.com/api/webhooks/...",
        required: true
      }
    ]
  }
];