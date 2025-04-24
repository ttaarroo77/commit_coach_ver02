-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create task_groups table
CREATE TABLE task_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  expanded BOOLEAN DEFAULT true,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES task_groups(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  start_time TEXT,
  end_time TEXT,
  status TEXT CHECK (status IN ('todo', 'in-progress', 'completed')) DEFAULT 'todo',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  progress INTEGER DEFAULT 0,
  expanded BOOLEAN DEFAULT false,
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subtasks table
CREATE TABLE subtasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE subtasks ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Projects policies
CREATE POLICY "Users can view all projects" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Users can create projects" ON projects
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update projects" ON projects
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete projects" ON projects
  FOR DELETE USING (true);

-- Task groups policies
CREATE POLICY "Users can view their own task groups" ON task_groups
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own task groups" ON task_groups
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own task groups" ON task_groups
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own task groups" ON task_groups
  FOR DELETE USING (auth.uid() = user_id);

-- Tasks policies
CREATE POLICY "Users can view their own tasks" ON tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM task_groups
      WHERE task_groups.id = tasks.group_id
      AND task_groups.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create tasks in their groups" ON tasks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM task_groups
      WHERE task_groups.id = tasks.group_id
      AND task_groups.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own tasks" ON tasks
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM task_groups
      WHERE task_groups.id = tasks.group_id
      AND task_groups.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own tasks" ON tasks
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM task_groups
      WHERE task_groups.id = tasks.group_id
      AND task_groups.user_id = auth.uid()
    )
  );

-- Subtasks policies
CREATE POLICY "Users can view their own subtasks" ON subtasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM tasks
      JOIN task_groups ON task_groups.id = tasks.group_id
      WHERE tasks.id = subtasks.task_id
      AND task_groups.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create subtasks in their tasks" ON subtasks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM tasks
      JOIN task_groups ON task_groups.id = tasks.group_id
      WHERE tasks.id = subtasks.task_id
      AND task_groups.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own subtasks" ON subtasks
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM tasks
      JOIN task_groups ON task_groups.id = tasks.group_id
      WHERE tasks.id = subtasks.task_id
      AND task_groups.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own subtasks" ON subtasks
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM tasks
      JOIN task_groups ON task_groups.id = tasks.group_id
      WHERE tasks.id = subtasks.task_id
      AND task_groups.user_id = auth.uid()
    )
  ); 