import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import { EMAIL_CONFIG } from '@/common/config/email';

interface WelcomeEmailParams {
  to: string;
  name: string;
}

interface LoginAttemptEmailParams {
  to: string;
  time: string;
}

interface TaskReminderEmailParams {
  to: string;
  name: string;
  taskTitle: string;
  dueDate: string;
}

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly templatesPath = path.join(__dirname, 'templates');

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: EMAIL_CONFIG.HOST,
      port: EMAIL_CONFIG.PORT,
      secure: false,
      auth: {
        user: EMAIL_CONFIG.USER,
        pass: EMAIL_CONFIG.PASSWORD,
      },
      logger: true,
    });
  }

  async sendWelcomeEmail(params: WelcomeEmailParams) {
    const html = await this.loadTemplate('welcome', { name: params.name });
    await this.transporter.sendMail({
      to: params.to,
      subject: 'Welcome to Our App!',
      html,
      from: EMAIL_CONFIG.FROM,
    });
  }

  async sendLoginAttemptEmail(params: LoginAttemptEmailParams) {
    const html = await this.loadTemplate('login-attempt', {
      time: params.time,
    });
    await this.transporter.sendMail({
      to: params.to,
      subject: 'You just logged in',
      html,
      from: EMAIL_CONFIG.FROM,
    });
  }

  async sendTaskReminder(params: TaskReminderEmailParams) {
    const html = await this.loadTemplate('task-reminder', {
      name: params.name,
      taskTitle: params.taskTitle,
      dueDate: params.dueDate,
    });
    await this.transporter.sendMail({
      to: params.to,
      subject: `Task Reminder: ${params.taskTitle}`,
      html,
      from: EMAIL_CONFIG.FROM,
    });
  }

  private async loadTemplate(
    templateName: string,
    data: Record<string, any>,
  ): Promise<string> {
    try {
      const templatePath = path.resolve(
        process.cwd(),
        `libs/common/src/services/email/templates/${templateName}.html`,
      );

      console.log(templatePath, 'templatePath');

      let html = await fs.promises.readFile(templatePath, 'utf-8');

      // Replace template variables
      html = html.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return data[key] !== undefined ? String(data[key]) : match;
      });

      return html;
    } catch (error) {
      return '<p>Email template not found</p>';
    }
  }
}
