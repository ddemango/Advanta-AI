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
  },
  {
    id: "content_approval",
    name: "Content Creation → Approval Workflow",
    description: "Route content through approval process before publishing to multiple channels.",
    category: "Marketing",
    make_scenario_id: "tuv678",
    icon: "fas fa-file-check",
    estimatedTime: "11 minutes",
    difficulty: "intermediate",
    fields: [
      { 
        label: "Content Management System URL", 
        name: "cms_url", 
        type: "url",
        placeholder: "https://your-cms.com",
        required: true
      },
      { 
        label: "CMS API Key", 
        name: "cms_api", 
        type: "password",
        placeholder: "cms-api-key",
        required: true
      },
      { 
        label: "Approver Email", 
        name: "approver_email", 
        type: "email",
        placeholder: "editor@company.com",
        required: true
      },
      { 
        label: "Publishing Channels", 
        name: "channels", 
        type: "text",
        placeholder: "wordpress,linkedin,twitter",
        required: true
      }
    ]
  },
  {
    id: "meeting_automation",
    name: "Calendar → Meeting Automation",
    description: "Auto-schedule meetings, send reminders, and create follow-up tasks.",
    category: "Productivity",
    make_scenario_id: "wxy901",
    icon: "fas fa-calendar-check",
    estimatedTime: "9 minutes",
    difficulty: "beginner",
    fields: [
      { 
        label: "Calendar API (Google/Outlook)", 
        name: "calendar_api", 
        type: "password",
        placeholder: "calendar-api-token",
        required: true
      },
      { 
        label: "Meeting Room Resource ID", 
        name: "room_id", 
        type: "text",
        placeholder: "conference-room-01",
        required: false
      },
      { 
        label: "Default Meeting Duration", 
        name: "duration", 
        type: "number",
        placeholder: "30",
        required: true
      },
      { 
        label: "Follow-up Task System", 
        name: "task_system", 
        type: "text",
        placeholder: "asana,trello,notion",
        required: false
      }
    ]
  },
  {
    id: "hr_onboarding",
    name: "HR Onboarding → Account Setup",
    description: "Automatically provision accounts and send welcome materials for new employees.",
    category: "Human Resources",
    make_scenario_id: "zab234",
    icon: "fas fa-user-plus",
    estimatedTime: "25 minutes",
    difficulty: "advanced",
    fields: [
      { 
        label: "HR Information System API", 
        name: "hris_api", 
        type: "password",
        placeholder: "hris-api-key",
        required: true
      },
      { 
        label: "Active Directory Endpoint", 
        name: "ad_endpoint", 
        type: "url",
        placeholder: "https://company.activeadmin.com",
        required: true
      },
      { 
        label: "Welcome Email Template", 
        name: "email_template", 
        type: "text",
        placeholder: "welcome-template-id",
        required: true
      },
      { 
        label: "IT Ticket System API", 
        name: "ticket_api", 
        type: "password",
        placeholder: "ticket-system-key",
        required: true
      }
    ]
  },
  {
    id: "quality_assurance",
    name: "Bug Reports → QA Assignment",
    description: "Automatically assign bug reports to QA teams based on severity and module.",
    category: "Development",
    make_scenario_id: "cde567",
    icon: "fas fa-bug",
    estimatedTime: "14 minutes",
    difficulty: "intermediate",
    fields: [
      { 
        label: "Bug Tracking System API", 
        name: "bug_api", 
        type: "password",
        placeholder: "jira-api-token",
        required: true
      },
      { 
        label: "QA Team Assignment Rules", 
        name: "assignment_rules", 
        type: "text",
        placeholder: "frontend:team-a,backend:team-b",
        required: true
      },
      { 
        label: "Severity Threshold", 
        name: "severity", 
        type: "text",
        placeholder: "high,critical",
        required: true
      },
      { 
        label: "Notification Channel", 
        name: "notification", 
        type: "text",
        placeholder: "slack,email,teams",
        required: true
      }
    ]
  },
  {
    id: "contract_management",
    name: "Contract Expiry → Renewal Process",
    description: "Monitor contract expiration dates and trigger renewal processes automatically.",
    category: "Legal",
    make_scenario_id: "fgh890",
    icon: "fas fa-file-contract",
    estimatedTime: "18 minutes",
    difficulty: "advanced",
    fields: [
      { 
        label: "Contract Database API", 
        name: "contract_api", 
        type: "password",
        placeholder: "contract-db-key",
        required: true
      },
      { 
        label: "Renewal Notice Period (days)", 
        name: "notice_period", 
        type: "number",
        placeholder: "90",
        required: true
      },
      { 
        label: "Legal Team Email", 
        name: "legal_email", 
        type: "email",
        placeholder: "legal@company.com",
        required: true
      },
      { 
        label: "Document Management System", 
        name: "doc_system", 
        type: "url",
        placeholder: "https://docs.company.com",
        required: true
      }
    ]
  },
  {
    id: "security_monitoring",
    name: "Security Alerts → Incident Response",
    description: "Detect security threats and automatically initiate incident response procedures.",
    category: "Security",
    make_scenario_id: "hij123",
    icon: "fas fa-shield-alt",
    estimatedTime: "22 minutes",
    difficulty: "advanced",
    fields: [
      { 
        label: "SIEM System API", 
        name: "siem_api", 
        type: "password",
        placeholder: "siem-api-key",
        required: true
      },
      { 
        label: "Threat Intelligence Feed", 
        name: "threat_feed", 
        type: "url",
        placeholder: "https://threatfeed.com/api",
        required: true
      },
      { 
        label: "Incident Response Team", 
        name: "response_team", 
        type: "email",
        placeholder: "security@company.com",
        required: true
      },
      { 
        label: "Escalation Threshold", 
        name: "escalation", 
        type: "text",
        placeholder: "medium,high,critical",
        required: true
      }
    ]
  },
  {
    id: "training_completion",
    name: "Training Completion → Certification",
    description: "Track training completion and automatically issue certificates and update records.",
    category: "Education",
    make_scenario_id: "klm456",
    icon: "fas fa-graduation-cap",
    estimatedTime: "16 minutes",
    difficulty: "intermediate",
    fields: [
      { 
        label: "Learning Management System API", 
        name: "lms_api", 
        type: "password",
        placeholder: "lms-api-key",
        required: true
      },
      { 
        label: "Certificate Template ID", 
        name: "cert_template", 
        type: "text",
        placeholder: "cert-template-123",
        required: true
      },
      { 
        label: "HR System Integration", 
        name: "hr_integration", 
        type: "password",
        placeholder: "hr-api-token",
        required: false
      },
      { 
        label: "Completion Threshold (%)", 
        name: "threshold", 
        type: "number",
        placeholder: "80",
        required: true
      }
    ]
  },
  {
    id: "supplier_management",
    name: "Supplier Performance → Vendor Rating",
    description: "Monitor supplier performance metrics and update vendor ratings automatically.",
    category: "Procurement",
    make_scenario_id: "nop789",
    icon: "fas fa-truck",
    estimatedTime: "20 minutes",
    difficulty: "advanced",
    fields: [
      { 
        label: "ERP System API", 
        name: "erp_api", 
        type: "password",
        placeholder: "erp-api-key",
        required: true
      },
      { 
        label: "Supplier Database URL", 
        name: "supplier_db", 
        type: "url",
        placeholder: "https://suppliers.company.com",
        required: true
      },
      { 
        label: "Performance Metrics", 
        name: "metrics", 
        type: "text",
        placeholder: "delivery_time,quality,cost",
        required: true
      },
      { 
        label: "Rating Update Frequency", 
        name: "frequency", 
        type: "text",
        placeholder: "weekly,monthly,quarterly",
        required: true
      }
    ]
  },
  {
    id: "asset_tracking",
    name: "Asset Lifecycle → Maintenance Alerts",
    description: "Track asset usage and automatically schedule maintenance based on usage patterns.",
    category: "Operations",
    make_scenario_id: "qrs012",
    icon: "fas fa-tools",
    estimatedTime: "17 minutes",
    difficulty: "intermediate",
    fields: [
      { 
        label: "Asset Management System API", 
        name: "asset_api", 
        type: "password",
        placeholder: "asset-mgmt-key",
        required: true
      },
      { 
        label: "IoT Sensor Integration", 
        name: "iot_endpoint", 
        type: "url",
        placeholder: "https://iot.company.com/api",
        required: false
      },
      { 
        label: "Maintenance Team Email", 
        name: "maintenance_email", 
        type: "email",
        placeholder: "maintenance@company.com",
        required: true
      },
      { 
        label: "Alert Threshold (usage hours)", 
        name: "usage_threshold", 
        type: "number",
        placeholder: "1000",
        required: true
      }
    ]
  },
  {
    id: "compliance_reporting",
    name: "Data Changes → Compliance Reports",
    description: "Monitor data changes and generate compliance reports for regulatory requirements.",
    category: "Compliance",
    make_scenario_id: "tuv345",
    icon: "fas fa-clipboard-check",
    estimatedTime: "24 minutes",
    difficulty: "advanced",
    fields: [
      { 
        label: "Database Audit Log API", 
        name: "audit_api", 
        type: "password",
        placeholder: "audit-log-key",
        required: true
      },
      { 
        label: "Compliance Framework", 
        name: "framework", 
        type: "text",
        placeholder: "GDPR,HIPAA,SOX",
        required: true
      },
      { 
        label: "Report Recipients", 
        name: "recipients", 
        type: "text",
        placeholder: "compliance@company.com,legal@company.com",
        required: true
      },
      { 
        label: "Report Generation Schedule", 
        name: "schedule", 
        type: "text",
        placeholder: "daily,weekly,monthly",
        required: true
      }
    ]
  },
  {
    id: "customer_churn",
    name: "Usage Analytics → Churn Prevention",
    description: "Analyze customer usage patterns and trigger retention campaigns for at-risk customers.",
    category: "Customer Success",
    make_scenario_id: "wxy678",
    icon: "fas fa-chart-line-down",
    estimatedTime: "19 minutes",
    difficulty: "advanced",
    fields: [
      { 
        label: "Analytics Platform API", 
        name: "analytics_api", 
        type: "password",
        placeholder: "analytics-key",
        required: true
      },
      { 
        label: "Customer Success Platform", 
        name: "cs_platform", 
        type: "password",
        placeholder: "cs-platform-key",
        required: true
      },
      { 
        label: "Churn Risk Threshold", 
        name: "risk_threshold", 
        type: "number",
        placeholder: "70",
        required: true
      },
      { 
        label: "Retention Campaign System", 
        name: "campaign_system", 
        type: "password",
        placeholder: "marketing-automation-key",
        required: true
      }
    ]
  },
  {
    id: "deployment_pipeline",
    name: "Code Commit → Deployment Pipeline",
    description: "Automatically trigger testing and deployment pipeline when code is committed.",
    category: "Development",
    make_scenario_id: "zab901",
    icon: "fab fa-git-alt",
    estimatedTime: "15 minutes",
    difficulty: "intermediate",
    fields: [
      { 
        label: "Git Repository Webhook", 
        name: "git_webhook", 
        type: "url",
        placeholder: "https://github.com/user/repo/webhooks",
        required: true
      },
      { 
        label: "CI/CD Platform API", 
        name: "cicd_api", 
        type: "password",
        placeholder: "jenkins-api-token",
        required: true
      },
      { 
        label: "Test Environment URL", 
        name: "test_env", 
        type: "url",
        placeholder: "https://test.company.com",
        required: true
      },
      { 
        label: "Deployment Approval Team", 
        name: "approval_team", 
        type: "email",
        placeholder: "devops@company.com",
        required: true
      }
    ]
  },
  {
    id: "event_registration",
    name: "Event Registration → Welcome Sequence",
    description: "Process event registrations and trigger personalized welcome email sequences.",
    category: "Events",
    make_scenario_id: "cde234",
    icon: "fas fa-calendar-plus",
    estimatedTime: "12 minutes",
    difficulty: "beginner",
    fields: [
      { 
        label: "Event Platform API", 
        name: "event_api", 
        type: "password",
        placeholder: "eventbrite-api-key",
        required: true
      },
      { 
        label: "Email Marketing Platform", 
        name: "email_platform", 
        type: "password",
        placeholder: "mailchimp-api-key",
        required: true
      },
      { 
        label: "Welcome Sequence ID", 
        name: "sequence_id", 
        type: "text",
        placeholder: "welcome-sequence-123",
        required: true
      },
      { 
        label: "Event Reminder Days", 
        name: "reminder_days", 
        type: "text",
        placeholder: "7,3,1",
        required: true
      }
    ]
  },
  {
    id: "performance_review",
    name: "Performance Data → Review Scheduling",
    description: "Analyze performance metrics and automatically schedule review meetings.",
    category: "Human Resources",
    make_scenario_id: "fgh567",
    icon: "fas fa-chart-bar",
    estimatedTime: "21 minutes",
    difficulty: "advanced",
    fields: [
      { 
        label: "Performance Management System", 
        name: "perf_system", 
        type: "password",
        placeholder: "performance-api-key",
        required: true
      },
      { 
        label: "Calendar Integration API", 
        name: "calendar_integration", 
        type: "password",
        placeholder: "calendar-api-token",
        required: true
      },
      { 
        label: "Review Cycle Frequency", 
        name: "cycle_frequency", 
        type: "text",
        placeholder: "quarterly,biannual,annual",
        required: true
      },
      { 
        label: "Manager Notification Email", 
        name: "manager_email", 
        type: "email",
        placeholder: "managers@company.com",
        required: true
      }
    ]
  },
  {
    id: "google_sheets_crm",
    name: "Google Sheets → CRM Sync",
    description: "Sync lead data from Google Sheets to your CRM system automatically.",
    category: "Lead Generation",
    make_scenario_id: "gsh001",
    icon: "fab fa-google",
    estimatedTime: "8 minutes",
    difficulty: "beginner",
    fields: [
      { 
        label: "Google Sheets ID", 
        name: "sheet_id", 
        type: "text",
        placeholder: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
        required: true
      },
      { 
        label: "Worksheet Name", 
        name: "worksheet", 
        type: "text",
        placeholder: "Leads",
        required: true
      },
      { 
        label: "CRM Webhook URL", 
        name: "crm_webhook", 
        type: "url",
        placeholder: "https://api.yourcrm.com/webhooks/leads",
        required: true
      }
    ]
  },
  {
    id: "salesforce_integration",
    name: "Salesforce → Multi-Channel Sync",
    description: "Sync Salesforce opportunities with email marketing and project management tools.",
    category: "Sales",
    make_scenario_id: "sf001",
    icon: "fab fa-salesforce",
    estimatedTime: "18 minutes",
    difficulty: "advanced",
    fields: [
      { 
        label: "Salesforce Instance URL", 
        name: "sf_instance", 
        type: "url",
        placeholder: "https://yourcompany.salesforce.com",
        required: true
      },
      { 
        label: "Salesforce API Token", 
        name: "sf_token", 
        type: "password",
        placeholder: "your-salesforce-token",
        required: true
      },
      { 
        label: "Email Platform Integration", 
        name: "email_platform", 
        type: "text",
        placeholder: "mailchimp,hubspot,marketo",
        required: true
      }
    ]
  },
  {
    id: "hubspot_workflows",
    name: "HubSpot → Automated Workflows",
    description: "Create automated workflows in HubSpot based on contact behavior and properties.",
    category: "Marketing",
    make_scenario_id: "hs001",
    icon: "fas fa-hubspot",
    estimatedTime: "15 minutes",
    difficulty: "intermediate",
    fields: [
      { 
        label: "HubSpot API Key", 
        name: "hubspot_key", 
        type: "password",
        placeholder: "pat-na1-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        required: true
      },
      { 
        label: "Workflow Trigger", 
        name: "trigger", 
        type: "text",
        placeholder: "form_submit,email_open,page_view",
        required: true
      },
      { 
        label: "Contact Properties", 
        name: "properties", 
        type: "text",
        placeholder: "firstname,email,company",
        required: true
      }
    ]
  },
  {
    id: "mailchimp_campaigns",
    name: "Mailchimp → Campaign Automation",
    description: "Automatically create and send Mailchimp campaigns based on triggers.",
    category: "Email Marketing",
    make_scenario_id: "mc001",
    icon: "fab fa-mailchimp",
    estimatedTime: "12 minutes",
    difficulty: "intermediate",
    fields: [
      { 
        label: "Mailchimp API Key", 
        name: "mailchimp_key", 
        type: "password",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-us1",
        required: true
      },
      { 
        label: "Audience ID", 
        name: "audience_id", 
        type: "text",
        placeholder: "xxxxxxxxxx",
        required: true
      },
      { 
        label: "Campaign Template ID", 
        name: "template_id", 
        type: "text",
        placeholder: "123456",
        required: true
      }
    ]
  },
  {
    id: "zoom_meetings",
    name: "Zoom → Meeting Automation",
    description: "Automatically schedule Zoom meetings and send calendar invites.",
    category: "Communication",
    make_scenario_id: "zm001",
    icon: "fas fa-video",
    estimatedTime: "10 minutes",
    difficulty: "beginner",
    fields: [
      { 
        label: "Zoom API Key", 
        name: "zoom_key", 
        type: "password",
        placeholder: "zoom-api-key",
        required: true
      },
      { 
        label: "Meeting Duration (minutes)", 
        name: "duration", 
        type: "number",
        placeholder: "60",
        required: true
      },
      { 
        label: "Default Host Email", 
        name: "host_email", 
        type: "email",
        placeholder: "host@company.com",
        required: true
      }
    ]
  },
  {
    id: "microsoft_teams",
    name: "Microsoft Teams → Notification Hub",
    description: "Send automated notifications to Teams channels based on business events.",
    category: "Communication",
    make_scenario_id: "mt001",
    icon: "fab fa-microsoft",
    estimatedTime: "9 minutes",
    difficulty: "beginner",
    fields: [
      { 
        label: "Teams Webhook URL", 
        name: "teams_webhook", 
        type: "url",
        placeholder: "https://outlook.office.com/webhook/...",
        required: true
      },
      { 
        label: "Channel Name", 
        name: "channel", 
        type: "text",
        placeholder: "General",
        required: true
      },
      { 
        label: "Message Template", 
        name: "template", 
        type: "text",
        placeholder: "New lead: {name} from {company}",
        required: true
      }
    ]
  },
  {
    id: "jira_automation",
    name: "Jira → Project Automation",
    description: "Automatically create and assign Jira tickets based on external triggers.",
    category: "Development",
    make_scenario_id: "jr001",
    icon: "fab fa-atlassian",
    estimatedTime: "16 minutes",
    difficulty: "intermediate",
    fields: [
      { 
        label: "Jira Instance URL", 
        name: "jira_url", 
        type: "url",
        placeholder: "https://yourcompany.atlassian.net",
        required: true
      },
      { 
        label: "Jira API Token", 
        name: "jira_token", 
        type: "password",
        placeholder: "your-jira-api-token",
        required: true
      },
      { 
        label: "Project Key", 
        name: "project_key", 
        type: "text",
        placeholder: "PROJ",
        required: true
      },
      { 
        label: "Default Assignee", 
        name: "assignee", 
        type: "email",
        placeholder: "developer@company.com",
        required: true
      }
    ]
  },
  {
    id: "trello_boards",
    name: "Trello → Board Management",
    description: "Automatically create Trello cards and move them through workflow stages.",
    category: "Project Management",
    make_scenario_id: "tr001",
    icon: "fab fa-trello",
    estimatedTime: "11 minutes",
    difficulty: "beginner",
    fields: [
      { 
        label: "Trello API Key", 
        name: "trello_key", 
        type: "password",
        placeholder: "your-trello-api-key",
        required: true
      },
      { 
        label: "Trello Token", 
        name: "trello_token", 
        type: "password",
        placeholder: "your-trello-token",
        required: true
      },
      { 
        label: "Board ID", 
        name: "board_id", 
        type: "text",
        placeholder: "5e6b8b5c1d4e8a0c9b1f2e3d",
        required: true
      },
      { 
        label: "Default List", 
        name: "list_name", 
        type: "text",
        placeholder: "To Do",
        required: true
      }
    ]
  },
  {
    id: "asana_tasks",
    name: "Asana → Task Automation",
    description: "Create and manage Asana tasks automatically from various data sources.",
    category: "Project Management",
    make_scenario_id: "as001",
    icon: "fas fa-tasks",
    estimatedTime: "13 minutes",
    difficulty: "intermediate",
    fields: [
      { 
        label: "Asana Personal Access Token", 
        name: "asana_token", 
        type: "password",
        placeholder: "1/xxxxxxxx:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        required: true
      },
      { 
        label: "Project GID", 
        name: "project_gid", 
        type: "text",
        placeholder: "1234567890123456",
        required: true
      },
      { 
        label: "Default Assignee Email", 
        name: "assignee_email", 
        type: "email",
        placeholder: "assignee@company.com",
        required: true
      }
    ]
  },
  {
    id: "monday_workflows",
    name: "Monday.com → Workflow Automation",
    description: "Automate Monday.com board updates and notifications based on project milestones.",
    category: "Project Management",
    make_scenario_id: "mn001",
    icon: "fas fa-calendar-week",
    estimatedTime: "14 minutes",
    difficulty: "intermediate",
    fields: [
      { 
        label: "Monday.com API Token", 
        name: "monday_token", 
        type: "password",
        placeholder: "your-monday-api-token",
        required: true
      },
      { 
        label: "Board ID", 
        name: "board_id", 
        type: "number",
        placeholder: "123456789",
        required: true
      },
      { 
        label: "Workspace ID", 
        name: "workspace_id", 
        type: "number",
        placeholder: "987654321",
        required: true
      }
    ]
  },
  {
    id: "aws_s3_backup",
    name: "AWS S3 → Automated Backup",
    description: "Automatically backup files and databases to AWS S3 with versioning.",
    category: "Cloud Storage",
    make_scenario_id: "s3001",
    icon: "fab fa-aws",
    estimatedTime: "19 minutes",
    difficulty: "advanced",
    fields: [
      { 
        label: "AWS Access Key ID", 
        name: "aws_key", 
        type: "password",
        placeholder: "AKIAIOSFODNN7EXAMPLE",
        required: true
      },
      { 
        label: "AWS Secret Access Key", 
        name: "aws_secret", 
        type: "password",
        placeholder: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
        required: true
      },
      { 
        label: "S3 Bucket Name", 
        name: "bucket_name", 
        type: "text",
        placeholder: "my-backup-bucket",
        required: true
      },
      { 
        label: "AWS Region", 
        name: "region", 
        type: "text",
        placeholder: "us-east-1",
        required: true
      }
    ]
  },
  {
    id: "dropbox_sync",
    name: "Dropbox → File Sync",
    description: "Automatically sync files between Dropbox and other cloud storage services.",
    category: "Cloud Storage",
    make_scenario_id: "db001",
    icon: "fab fa-dropbox",
    estimatedTime: "10 minutes",
    difficulty: "beginner",
    fields: [
      { 
        label: "Dropbox Access Token", 
        name: "dropbox_token", 
        type: "password",
        placeholder: "sl.xxxxxxxxxxxxxxxxxx",
        required: true
      },
      { 
        label: "Source Folder Path", 
        name: "source_path", 
        type: "text",
        placeholder: "/Business/Documents",
        required: true
      },
      { 
        label: "Sync Frequency", 
        name: "frequency", 
        type: "text",
        placeholder: "hourly,daily,weekly",
        required: true
      }
    ]
  },
  {
    id: "facebook_ads",
    name: "Facebook Ads → Performance Reports",
    description: "Generate automated Facebook Ads performance reports and send to stakeholders.",
    category: "Advertising",
    make_scenario_id: "fb001",
    icon: "fab fa-facebook",
    estimatedTime: "17 minutes",
    difficulty: "advanced",
    fields: [
      { 
        label: "Facebook Access Token", 
        name: "fb_token", 
        type: "password",
        placeholder: "EAAxxxxxxxxxxxxxxxxx",
        required: true
      },
      { 
        label: "Ad Account ID", 
        name: "ad_account", 
        type: "text",
        placeholder: "act_123456789",
        required: true
      },
      { 
        label: "Report Email Recipients", 
        name: "recipients", 
        type: "text",
        placeholder: "marketing@company.com,cmo@company.com",
        required: true
      },
      { 
        label: "Report Frequency", 
        name: "frequency", 
        type: "text",
        placeholder: "daily,weekly,monthly",
        required: true
      }
    ]
  },
  {
    id: "google_ads_reporting",
    name: "Google Ads → ROI Analytics",
    description: "Track Google Ads performance and automatically optimize bidding strategies.",
    category: "Advertising",
    make_scenario_id: "ga001",
    icon: "fab fa-google",
    estimatedTime: "20 minutes",
    difficulty: "advanced",
    fields: [
      { 
        label: "Google Ads Customer ID", 
        name: "customer_id", 
        type: "text",
        placeholder: "123-456-7890",
        required: true
      },
      { 
        label: "Google Ads API Token", 
        name: "ads_token", 
        type: "password",
        placeholder: "your-google-ads-token",
        required: true
      },
      { 
        label: "Target ROAS", 
        name: "target_roas", 
        type: "number",
        placeholder: "4.0",
        required: true
      },
      { 
        label: "Campaign ID", 
        name: "campaign_id", 
        type: "text",
        placeholder: "123456789",
        required: true
      }
    ]
  },
  {
    id: "instagram_content",
    name: "Instagram → Content Scheduler",
    description: "Automatically schedule and post Instagram content from your content library.",
    category: "Social Media",
    make_scenario_id: "ig001",
    icon: "fab fa-instagram",
    estimatedTime: "13 minutes",
    difficulty: "intermediate",
    fields: [
      { 
        label: "Instagram Business Account ID", 
        name: "ig_account", 
        type: "text",
        placeholder: "17841400455970028",
        required: true
      },
      { 
        label: "Facebook Page Access Token", 
        name: "page_token", 
        type: "password",
        placeholder: "EAAxxxxxxxxxxxxxxxxx",
        required: true
      },
      { 
        label: "Content Folder Path", 
        name: "content_path", 
        type: "text",
        placeholder: "/Content/Instagram",
        required: true
      },
      { 
        label: "Posting Schedule", 
        name: "schedule", 
        type: "text",
        placeholder: "9:00,13:00,17:00",
        required: true
      }
    ]
  },
  {
    id: "tiktok_analytics",
    name: "TikTok → Analytics Dashboard",
    description: "Track TikTok content performance and generate engagement reports.",
    category: "Social Media",
    make_scenario_id: "tt001",
    icon: "fab fa-tiktok",
    estimatedTime: "15 minutes",
    difficulty: "intermediate",
    fields: [
      { 
        label: "TikTok Business Account ID", 
        name: "tiktok_account", 
        type: "text",
        placeholder: "123456789012345678",
        required: true
      },
      { 
        label: "TikTok Access Token", 
        name: "tiktok_token", 
        type: "password",
        placeholder: "act.xxxxxxxxxxxxxxxxxx",
        required: true
      },
      { 
        label: "Analytics Dashboard URL", 
        name: "dashboard_url", 
        type: "url",
        placeholder: "https://analytics.company.com",
        required: true
      }
    ]
  },
  {
    id: "quickbooks_invoicing",
    name: "QuickBooks → Invoice Automation",
    description: "Automatically create and send QuickBooks invoices based on project completion.",
    category: "Accounting",
    make_scenario_id: "qb001",
    icon: "fas fa-calculator",
    estimatedTime: "18 minutes",
    difficulty: "advanced",
    fields: [
      { 
        label: "QuickBooks Company ID", 
        name: "qb_company", 
        type: "text",
        placeholder: "123456789012345",
        required: true
      },
      { 
        label: "QuickBooks Access Token", 
        name: "qb_token", 
        type: "password",
        placeholder: "your-quickbooks-token",
        required: true
      },
      { 
        label: "Default Payment Terms", 
        name: "payment_terms", 
        type: "text",
        placeholder: "Net 30",
        required: true
      },
      { 
        label: "Tax Rate (%)", 
        name: "tax_rate", 
        type: "number",
        placeholder: "8.5",
        required: false
      }
    ]
  },
  {
    id: "xero_accounting",
    name: "Xero → Financial Reporting",
    description: "Generate automated financial reports from Xero and distribute to stakeholders.",
    category: "Accounting",
    make_scenario_id: "xe001",
    icon: "fas fa-chart-pie",
    estimatedTime: "16 minutes",
    difficulty: "intermediate",
    fields: [
      { 
        label: "Xero Tenant ID", 
        name: "xero_tenant", 
        type: "text",
        placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        required: true
      },
      { 
        label: "Xero Access Token", 
        name: "xero_token", 
        type: "password",
        placeholder: "your-xero-access-token",
        required: true
      },
      { 
        label: "Report Types", 
        name: "report_types", 
        type: "text",
        placeholder: "BalanceSheet,ProfitAndLoss,CashFlow",
        required: true
      },
      { 
        label: "Report Recipients", 
        name: "recipients", 
        type: "text",
        placeholder: "cfo@company.com,accounting@company.com",
        required: true
      }
    ]
  },
  {
    id: "intercom_support",
    name: "Intercom → Customer Support",
    description: "Automatically route and prioritize Intercom conversations based on customer data.",
    category: "Customer Support",
    make_scenario_id: "ic001",
    icon: "fas fa-comments",
    estimatedTime: "14 minutes",
    difficulty: "intermediate",
    fields: [
      { 
        label: "Intercom Access Token", 
        name: "intercom_token", 
        type: "password",
        placeholder: "dG9rOmxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        required: true
      },
      { 
        label: "Priority Customer Tags", 
        name: "priority_tags", 
        type: "text",
        placeholder: "enterprise,vip,premium",
        required: true
      },
      { 
        label: "Assignment Rules", 
        name: "assignment_rules", 
        type: "text",
        placeholder: "billing:team-a,technical:team-b",
        required: true
      }
    ]
  },
  {
    id: "zendesk_tickets",
    name: "Zendesk → Ticket Management",
    description: "Automatically create and route Zendesk tickets from multiple channels.",
    category: "Customer Support",
    make_scenario_id: "zd001",
    icon: "fas fa-ticket-alt",
    estimatedTime: "12 minutes",
    difficulty: "beginner",
    fields: [
      { 
        label: "Zendesk Subdomain", 
        name: "zendesk_subdomain", 
        type: "text",
        placeholder: "yourcompany",
        required: true
      },
      { 
        label: "Zendesk API Token", 
        name: "zendesk_token", 
        type: "password",
        placeholder: "your-zendesk-api-token",
        required: true
      },
      { 
        label: "Admin Email", 
        name: "admin_email", 
        type: "email",
        placeholder: "admin@company.com",
        required: true
      },
      { 
        label: "Default Priority", 
        name: "priority", 
        type: "text",
        placeholder: "normal,high,urgent",
        required: true
      }
    ]
  }
];