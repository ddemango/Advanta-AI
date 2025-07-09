# Email Setup Instructions for Password Reset

## Current Issue
The password reset system is implemented but emails are not being sent because Gmail requires app-specific passwords for SMTP authentication, not regular account passwords.

## Solution Steps

### For Gmail Account (D.s.demango@gmail.com):

1. **Enable 2-Factor Authentication**
   - Go to Google Account settings
   - Security → 2-Step Verification
   - Enable if not already enabled

2. **Generate App Password**
   - Go to Google Account settings  
   - Security → 2-Step Verification → App passwords
   - Select "Mail" and "Other (custom name)"
   - Name it "Advanta AI Password Reset"
   - Copy the 16-character app password

3. **Update Environment Variables**
   - Use D.s.demango@gmail.com as EMAIL_USER
   - Use the generated app password as EMAIL_PASS

## Alternative: Use SendGrid or Similar Service
For production environments, consider using SendGrid, AWS SES, or similar email service providers which are more reliable for transactional emails.

## Current System Status
- ✅ Password reset form and UI complete
- ✅ Database schema for reset tokens
- ✅ Backend endpoints for forgot/reset password
- ❌ Email delivery (requires app password setup)
- ✅ Password reset page for token verification

## Test Commands
```bash
# Test forgot password
curl -X POST http://localhost:5000/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "D.s.demango@gmail.com"}'

# Test email service (when credentials are fixed)
curl -X POST http://localhost:5000/auth/test-email \
  -H "Content-Type: application/json" \
  -d '{"email": "D.s.demango@gmail.com"}'
```