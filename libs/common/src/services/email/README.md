# Email Service

A comprehensive email service for sending HTML templated emails using Nodemailer.

## Features

- HTML email templates with modern design
- Template variable replacement
- Multiple email types (welcome, password reset, verification, task reminders)
- Attachment support
- Configurable SMTP settings
- Error handling and logging

## Configuration

Add the following environment variables to your `.env` file:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@yourdomain.com
EMAIL_SECURE=false
```

## Usage

### 1. Import the EmailModule

```typescript
import { EmailModule } from '@/common/services/email';

@Module({
  imports: [EmailModule],
  // ...
})
export class YourModule {}
```

### 2. Inject and use the EmailService

```typescript
import { EmailService } from '@/common/services/email';

@Injectable()
export class YourService {
  constructor(private readonly emailService: EmailService) {}

  async sendWelcomeEmail() {
    const success = await this.emailService.sendWelcomeEmail(
      'user@example.com',
      {
        name: 'John Doe',
        activationLink: 'https://yourapp.com/activate?token=abc123',
      },
    );

    if (success) {
      console.log('Welcome email sent successfully');
    }
  }
}
```

## Available Email Methods

### 1. sendWelcomeEmail

```typescript
await emailService.sendWelcomeEmail(to: string, data: {
  name: string;
  activationLink?: string;
});
```

### 2. sendPasswordResetEmail

```typescript
await emailService.sendPasswordResetEmail(to: string, data: {
  name: string;
  resetLink: string;
});
```

### 3. sendVerificationEmail

```typescript
await emailService.sendVerificationEmail(to: string, data: {
  name: string;
  verificationLink: string;
});
```

### 4. sendTaskReminderEmail

```typescript
await emailService.sendTaskReminderEmail(to: string, data: {
  name: string;
  taskTitle: string;
  dueDate: string;
});
```

## Custom Email Templates

### 1. Create a new template

Create a new HTML file in `templates/` directory:

```html
<!-- SUBJECT: Your Email Subject -->
<!DOCTYPE html>
<html>
  <head>
    <title>Your Template</title>
    <style>
      /* Your CSS styles */
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Hello {{name}}</h1>
      <p>{{message}}</p>
    </div>
  </body>
</html>
```

### 2. Send custom email

```typescript
await emailService.sendEmail({
  to: 'user@example.com',
  subject: 'Custom Subject',
  template: 'your-template-name', // without .html extension
  data: {
    name: 'John Doe',
    message: 'This is a custom message',
  },
});
```

## Template Variables

Use `{{variableName}}` syntax in your HTML templates. The service will automatically replace these with the provided data.

## Gmail Setup

To use Gmail SMTP:

1. Enable 2-factor authentication on your Google account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
3. Use the generated password as `EMAIL_PASSWORD`

## Error Handling

The service returns `boolean` values indicating success/failure and logs errors automatically. Check the logs for detailed error information.

## Templates Directory Structure

```
templates/
├── welcome.html
├── password-reset.html
├── email-verification.html
└── task-reminder.html
```

Each template should include a subject comment at the top:

```html
<!-- SUBJECT: Your Email Subject -->
```
