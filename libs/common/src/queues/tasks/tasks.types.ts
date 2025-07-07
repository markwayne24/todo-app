export type SendTaskStatusUpdateEmailType = {
  id: string;
  email: string;
  name: string;
  taskTitle: string;
  status: string;
};

export type SendTaskReminderType = {
  userId: string;
  name: string;
  email: string;
  tasks: {
    _id: string;
    taskTitle: string;
    dueDate: Date;
    status: string;
  }[];
};

export type SendTaskOverdueType = {
  userId: string;
  name: string;
  email: string;
  tasks: {
    _id: string;
    taskTitle: string;
    dueDate: Date;
    status: string;
  }[];
};

export type UpdateOverdueStatusType = {
  tasks: {
    _id: string;
    taskTitle: string;
    dueDate: Date;
    status: string;
  }[];
};
