import { ObjectId } from 'mongodb';

export type Task = {
  _id?: ObjectId;
  userId: ObjectId;
  title: string;
  description?: string;
  status: string;
  scheduledTime: Date;
  priority: 'low' | 'medium' | 'high';
  category?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
