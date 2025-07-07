import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import { EMAIL_CONFIG } from '@/common/config/email';
import Handlebars from 'handlebars';

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
  tasks: { taskTitle: string; dueDate: Date }[];
}

interface TaskOverdueEmailParams {
  to: string;
  name: string;
  tasks: { taskTitle: string; dueDate: Date }[];
}

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

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
      tasks: params.tasks,
    });
    await this.transporter.sendMail({
      to: params.to,
      subject: `Task Reminder`,
      html,
      from: EMAIL_CONFIG.FROM,
    });
  }

  async sendTaskOverdueEmail(params: TaskOverdueEmailParams) {
    const html = await this.loadTemplate('task-overdue', {
      name: params.name,
      tasks: params.tasks,
    });
    await this.transporter.sendMail({
      to: params.to,
      subject: `Overdue Tasks Alert`,
      html,
      from: EMAIL_CONFIG.FROM,
    });
  }

  async sendTaskStatusUpdateEmail(params: {
    to: string;
    name: string;
    taskTitle: string;
    status: string;
  }) {
    const html = await this.loadTemplate('tasks-status-update', {
      name: params.name,
      taskTitle: params.taskTitle,
      status: params.status,
      updatedAt: new Date().toISOString(),
    });

    await this.transporter.sendMail({
      to: params.to,
      subject: `Task Updated: ${params.taskTitle} → ${params.status}`,
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

      const html = await fs.promises.readFile(templatePath, 'utf-8');

      const template = Handlebars.compile(html);
      return template(data);
    } catch (error) {
      return '<p>Email template not found</p>';
    }
  }
}
