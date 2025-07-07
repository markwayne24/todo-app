// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time

// Switch to the to-do database
db = db.getSiblingDB('to-do');

// Create a user for the to-do database
db.createUser({
  user: process.env.MONGO_ROOT_USERNAME || 'admin',
  pwd: process.env.MONGO_ROOT_PASSWORD || 'password123',
  roles: [
    {
      role: 'readWrite',
      db: 'to-do',
    },
  ],
});

// Create collections if they don't exist
db.createCollection('users');
db.createCollection('tasks');

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.tasks.createIndex({ userId: 1 });
db.tasks.createIndex({ status: 1 });
db.tasks.createIndex({ priority: 1 });
db.tasks.createIndex({ category: 1 });
db.tasks.createIndex({ dueDate: 1 });

// Get environment variables with defaults
const defaultName = process.env.DEFAULT_USER_NAME || 'John Doe';
const defaultUserEmail =
  process.env.DEFAULT_USER_EMAIL || 'johnDoe@example.com';
const defaultUserPassword =
  process.env.DEFAULT_USER_PASSWORD ||
  '$2a$10$3uMMdJTTBZNuLVFZT2czLuaY/d1WVx7zguTJ0oZ55coDaeNdBcW6O';

// Check if default user already exists
const existingUser = db.users.findOne({ email: defaultUserEmail });

if (!existingUser) {
  print('Creating default user...');

  // Create default user
  const defaultUser = {
    email: defaultUserEmail,
    password: defaultUserPassword,
    name: defaultName,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = db.users.insertOne(defaultUser);

  if (result.insertedId) {
    print('Default user created successfully with ID: ' + result.insertedId);

    // Create a sample task for the default user
    const sampleTask = {
      title: 'Welcome to your Todo App!',
      description:
        'This is your first task. You can edit, delete, or mark it as completed.',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      priority: 'medium',
      category: 'personal',
      status: 'pending',
      userId: result.insertedId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const taskResult = db.tasks.insertOne(sampleTask);
    if (taskResult.insertedId) {
      print(
        'Sample task created successfully with ID: ' + taskResult.insertedId,
      );
    } else {
      print('Failed to create sample task');
    }
  } else {
    print('Failed to create default user');
  }
} else {
  print('Default user already exists, skipping creation');
}

print('MongoDB initialization completed successfully!');
print(
  'Database setup: collections, indexes, default user, and initial task created',
);
