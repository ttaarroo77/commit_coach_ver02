-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'todo',
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subtasks table
CREATE TABLE subtasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ai_messages table
CREATE TABLE ai_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_projects_owner ON projects(owner_id);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_subtasks_task_id ON subtasks(task_id);
CREATE INDEX idx_ai_messages_user_id ON ai_messages(user_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can only access their own data" ON users
  FOR ALL USING (auth.uid() = id);

-- Drop existing project policies if they exist
DROP POLICY IF EXISTS "Users can view their own projects" ON projects;
DROP POLICY IF EXISTS "Users can create their own projects" ON projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON projects;

-- Create new project policies with simplified conditions
CREATE POLICY "Users can view their own projects" ON projects
  FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Users can create their own projects" ON projects
  FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update their own projects" ON projects
  FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Users can delete their own projects" ON projects
  FOR DELETE USING (owner_id = auth.uid());

-- Drop existing policies
DROP POLICY IF EXISTS "Users can only access tasks in their projects" ON tasks;
DROP POLICY IF EXISTS "Users can only access subtasks in their tasks" ON subtasks;

-- Create new task policy
CREATE POLICY "Users can only access tasks in their projects" ON tasks
  FOR ALL USING (
    auth.uid() IN (
      SELECT owner_id FROM projects WHERE id = tasks.project_id
    )
  );

-- Create new subtask policy
CREATE POLICY "Users can only access subtasks in their tasks" ON subtasks
  FOR ALL USING (
    auth.uid() IN (
      SELECT p.owner_id
      FROM tasks t
      JOIN projects p ON p.id = t.project_id
      WHERE t.id = subtasks.task_id
    )
  );

CREATE POLICY "Users can only access their own AI messages" ON ai_messages
  FOR ALL USING (auth.uid() = user_id);
