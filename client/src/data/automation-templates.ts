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
  },
  {
    id: "linkedin_to_crm",
    name: "LinkedIn Leads → CRM",
    description: "Automatically import LinkedIn Sales Navigator leads into your CRM system.",
    category: "Lead Generation",
    make_scenario_id: "pqr678",
    icon: "fab fa-linkedin",
    estimatedTime: "12 minutes",
    difficulty: "advanced",
    fields: [
      { 
        label: "LinkedIn Sales Navigator Cookie", 
        name: "linkedin_cookie", 
        type: "password",
        placeholder: "li_at cookie value",
        required: true
      },
      { 
        label: "CRM API Endpoint", 
        name: "crm_endpoint", 
        type: "url",
        placeholder: "https://api.yourcrm.com/contacts",
        required: true
      },
      { 
        label: "CRM API Key", 
        name: "crm_api_key", 
        type: "password",
        placeholder: "your-crm-api-key",
        required: true
      }
    ]
  },
  {
    id: "youtube_to_social",
    name: "YouTube Upload → Social Media",
    description: "Auto-post to Twitter, LinkedIn, and Facebook when you upload a new YouTube video.",
    category: "Marketing",
    make_scenario_id: "stu901",
    icon: "fab fa-youtube",
    estimatedTime: "15 minutes",
    difficulty: "intermediate",
    fields: [
      { 
        label: "YouTube Channel ID", 
        name: "youtube_channel", 
        type: "text",
        placeholder: "UCxxxxxxxxxxxxxxxxxxxxxxx",
        required: true
      },
      { 
        label: "YouTube API Key", 
        name: "youtube_api", 
        type: "password",
        placeholder: "AIzaSyxxxxxxxxxxxxx",
        required: true
      },
      { 
        label: "Twitter Bearer Token", 
        name: "twitter_token", 
        type: "password",
        placeholder: "AAAAAAAAAAAAAAAAAAAAAxxxxx",
        required: true
      },
      { 
        label: "LinkedIn Access Token", 
        name: "linkedin_token", 
        type: "password",
        placeholder: "AQVxxxxxxxxxxxxxx",
        required: false
      }
    ]
  },
  {
    id: "website_monitor",
    name: "Website Monitor → Alerts",
    description: "Monitor website uptime and performance, send alerts when issues are detected.",
    category: "Operations",
    make_scenario_id: "vwx234",
    icon: "fas fa-monitor-waveform",
    estimatedTime: "8 minutes",
    difficulty: "intermediate",
    fields: [
      { 
        label: "Website URL to Monitor", 
        name: "website_url", 
        type: "url",
        placeholder: "https://your-website.com",
        required: true
      },
      { 
        label: "Check Interval (minutes)", 
        name: "check_interval", 
        type: "number",
        placeholder: "5",
        required: true
      },
      { 
        label: "Alert Email", 
        name: "alert_email", 
        type: "email",
        placeholder: "alerts@yourcompany.com",
        required: true
      },
      { 
        label: "Slack Alert Webhook (Optional)", 
        name: "slack_alert", 
        type: "url",
        placeholder: "https://hooks.slack.com/services/...",
        required: false
      }
    ]
  },
  {
    id: "inventory_sync",
    name: "Inventory Sync → Multiple Platforms",
    description: "Sync inventory levels across Shopify, Amazon, eBay, and other sales channels.",
    category: "E-commerce",
    make_scenario_id: "yza567",
    icon: "fas fa-boxes",
    estimatedTime: "20 minutes",
    difficulty: "advanced",
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
        name: "shopify_api", 
        type: "password",
        placeholder: "shpat_xxxxxxxxxxxxx",
        required: true
      },
      { 
        label: "Amazon MWS Access Key", 
        name: "amazon_key", 
        type: "password",
        placeholder: "AKIAI...",
        required: false
      },
      { 
        label: "eBay Production App ID", 
        name: "ebay_app_id", 
        type: "text",
        placeholder: "YourAppI-xxxxx",
        required: false
      }
    ]
  },
  {
    id: "expense_tracker",
    name: "Receipt Scanner → Expense Tracking",
    description: "Scan receipts from email attachments and automatically categorize expenses.",
    category: "Finance",
    make_scenario_id: "bcd890",
    icon: "fas fa-receipt",
    estimatedTime: "10 minutes",
    difficulty: "intermediate",
    fields: [
      { 
        label: "Email Account (Gmail)", 
        name: "gmail_account", 
        type: "email",
        placeholder: "your-email@gmail.com",
        required: true
      },
      { 
        label: "Gmail App Password", 
        name: "gmail_password", 
        type: "password",
        placeholder: "16-character app password",
        required: true
      },
      { 
        label: "QuickBooks API Key", 
        name: "quickbooks_key", 
        type: "password",
        placeholder: "qb-api-key",
        required: false
      },
      { 
        label: "Expense Categories", 
        name: "categories", 
        type: "text",
        placeholder: "Travel,Meals,Office Supplies",
        required: true
      }
    ]
  },
  {
    id: "customer_feedback",
    name: "Customer Feedback → Analysis",
    description: "Collect feedback from multiple sources and generate sentiment analysis reports.",
    category: "Customer Service",
    make_scenario_id: "efg123",
    icon: "fas fa-comments",
    estimatedTime: "12 minutes",
    difficulty: "advanced",
    fields: [
      { 
        label: "Survey Platform API Key", 
        name: "survey_api", 
        type: "password",
        placeholder: "survey-platform-api-key",
        required: true
      },
      { 
        label: "Review Source (Google/Yelp)", 
        name: "review_source", 
        type: "text",
        placeholder: "google_my_business",
        required: true
      },
      { 
        label: "Report Email Recipients", 
        name: "report_emails", 
        type: "text",
        placeholder: "manager@company.com,team@company.com",
        required: true
      },
      { 
        label: "Analysis API Key", 
        name: "analysis_api", 
        type: "password",
        placeholder: "sentiment-analysis-key",
        required: true
      }
    ]
  },
  {
    id: "lead_scoring",
    name: "Lead Scoring → Sales Pipeline",
    description: "Automatically score leads based on behavior and route them to appropriate sales reps.",
    category: "Lead Generation",
    make_scenario_id: "hij456",
    icon: "fas fa-chart-line",
    estimatedTime: "18 minutes",
    difficulty: "advanced",
    fields: [
      { 
        label: "CRM System URL", 
        name: "crm_url", 
        type: "url",
        placeholder: "https://yourcompany.salesforce.com",
        required: true
      },
      { 
        label: "CRM API Token", 
        name: "crm_token", 
        type: "password",
        placeholder: "crm-api-token",
        required: true
      },
      { 
        label: "Scoring Rules", 
        name: "scoring_rules", 
        type: "text",
        placeholder: "email_open:5,page_visit:10,demo_request:50",
        required: true
      },
      { 
        label: "High Score Threshold", 
        name: "score_threshold", 
        type: "number",
        placeholder: "75",
        required: true
      }
    ]
  },
  {
    id: "social_listening",
    name: "Social Media Monitoring → Alerts",
    description: "Monitor brand mentions across social platforms and respond to urgent issues.",
    category: "Marketing",
    make_scenario_id: "klm789",
    icon: "fas fa-hashtag",
    estimatedTime: "14 minutes",
    difficulty: "intermediate",
    fields: [
      { 
        label: "Brand Keywords", 
        name: "brand_keywords", 
        type: "text",
        placeholder: "YourBrand,@yourbrand,#yourbrand",
        required: true
      },
      { 
        label: "Twitter API Bearer Token", 
        name: "twitter_bearer", 
        type: "password",
        placeholder: "AAAAAAAAAAAAAAAAAAA...",
        required: true
      },
      { 
        label: "Alert Threshold (mentions/hour)", 
        name: "alert_threshold", 
        type: "number",
        placeholder: "10",
        required: true
      },
      { 
        label: "Crisis Management Email", 
        name: "crisis_email", 
        type: "email",
        placeholder: "crisis@yourcompany.com",
        required: true
      }
    ]
  },
  {
    id: "backup_automation",
    name: "Database Backup → Cloud Storage",
    description: "Automatically backup databases and critical files to multiple cloud storage providers.",
    category: "Operations",
    make_scenario_id: "nop012",
    icon: "fas fa-cloud-upload",
    estimatedTime: "16 minutes",
    difficulty: "advanced",
    fields: [
      { 
        label: "Database Connection String", 
        name: "db_connection", 
        type: "password",
        placeholder: "postgresql://user:pass@host:port/db",
        required: true
      },
      { 
        label: "Backup Schedule", 
        name: "backup_schedule", 
        type: "text",
        placeholder: "daily, weekly, monthly",
        required: true
      },
      { 
        label: "AWS S3 Bucket", 
        name: "s3_bucket", 
        type: "text",
        placeholder: "your-backup-bucket",
        required: false
      },
      { 
        label: "Google Drive Folder ID", 
        name: "gdrive_folder", 
        type: "text",
        placeholder: "1BxiMVs0XRA5nFMdKv...",
        required: false
      }
    ]
  },
  {
    id: "invoice_automation",
    name: "Invoice Generation → Payment Tracking",
    description: "Generate invoices from project completion and track payment status automatically.",
    category: "Finance",
    make_scenario_id: "qrs345",
    icon: "fas fa-file-invoice-dollar",
    estimatedTime: "13 minutes",
    difficulty: "intermediate",
    fields: [
      { 
        label: "Project Management Tool API", 
        name: "project_api", 
        type: "password",
        placeholder: "project-tool-api-key",
        required: true
      },
      { 
        label: "Invoice Template ID", 
        name: "invoice_template", 
        type: "text",
        placeholder: "template-12345",
        required: true
      },
      { 
        label: "Payment Gateway API", 
        name: "payment_api", 
        type: "password",
        placeholder: "payment-gateway-key",
        required: true
      },
      { 
        label: "Default Payment Terms (days)", 
        name: "payment_terms", 
        type: "number",
        placeholder: "30",
        required: true
      }
    ]
  }
];