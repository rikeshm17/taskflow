-- TaskFlow Database Schema Migration
-- Run this in Supabase Dashboard → SQL Editor

-- ===========================
-- 1. SUBTASKS
-- ===========================
CREATE TABLE IF NOT EXISTS subtasks (
  id BIGSERIAL PRIMARY KEY,
  task_id BIGINT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subtasks_task_id ON subtasks(task_id);

ALTER TABLE subtasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subtasks"
  ON subtasks FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM tasks WHERE tasks.id = subtasks.task_id AND tasks.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own subtasks"
  ON subtasks FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM tasks WHERE tasks.id = subtasks.task_id AND tasks.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own subtasks"
  ON subtasks FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM tasks WHERE tasks.id = subtasks.task_id AND tasks.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own subtasks"
  ON subtasks FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM tasks WHERE tasks.id = subtasks.task_id AND tasks.user_id = auth.uid()
  ));

-- ===========================
-- 2. TAGS
-- ===========================
CREATE TABLE IF NOT EXISTS tags (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#FC563C',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, name)
);

CREATE INDEX IF NOT EXISTS idx_tags_user_id ON tags(user_id);

ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tags"
  ON tags FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own tags"
  ON tags FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own tags"
  ON tags FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own tags"
  ON tags FOR DELETE USING (user_id = auth.uid());

-- Task-Tag junction table
CREATE TABLE IF NOT EXISTS task_tags (
  id BIGSERIAL PRIMARY KEY,
  task_id BIGINT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  tag_id BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(task_id, tag_id)
);

CREATE INDEX IF NOT EXISTS idx_task_tags_task_id ON task_tags(task_id);
CREATE INDEX IF NOT EXISTS idx_task_tags_tag_id ON task_tags(tag_id);

ALTER TABLE task_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own task_tags"
  ON task_tags FOR SELECT USING (EXISTS (
    SELECT 1 FROM tasks WHERE tasks.id = task_tags.task_id AND tasks.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own task_tags"
  ON task_tags FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM tasks WHERE tasks.id = task_tags.task_id AND tasks.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own task_tags"
  ON task_tags FOR DELETE USING (EXISTS (
    SELECT 1 FROM tasks WHERE tasks.id = task_tags.task_id AND tasks.user_id = auth.uid()
  ));

-- ===========================
-- 3. POMODORO SESSIONS
-- ===========================
CREATE TABLE IF NOT EXISTS pomodoro_sessions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id BIGINT REFERENCES tasks(id) ON DELETE SET NULL,
  duration_minutes INTEGER DEFAULT 25,
  completed BOOLEAN DEFAULT FALSE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_pomodoro_user_id ON pomodoro_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_pomodoro_task_id ON pomodoro_sessions(task_id);

ALTER TABLE pomodoro_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own pomodoro sessions"
  ON pomodoro_sessions FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own pomodoro sessions"
  ON pomodoro_sessions FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own pomodoro sessions"
  ON pomodoro_sessions FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own pomodoro sessions"
  ON pomodoro_sessions FOR DELETE USING (user_id = auth.uid());

-- ===========================
-- 4. TASK DEPENDENCIES
-- ===========================
CREATE TABLE IF NOT EXISTS task_dependencies (
  id BIGSERIAL PRIMARY KEY,
  task_id BIGINT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  depends_on_task_id BIGINT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(task_id, depends_on_task_id),
  CHECK (task_id != depends_on_task_id)
);

CREATE INDEX IF NOT EXISTS idx_task_dependencies_task_id ON task_dependencies(task_id);
CREATE INDEX IF NOT EXISTS idx_task_dependencies_depends_on ON task_dependencies(depends_on_task_id);

ALTER TABLE task_dependencies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own task dependencies"
  ON task_dependencies FOR SELECT USING (EXISTS (
    SELECT 1 FROM tasks WHERE tasks.id = task_dependencies.task_id AND tasks.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own task dependencies"
  ON task_dependencies FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM tasks WHERE tasks.id = task_dependencies.task_id AND tasks.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own task dependencies"
  ON task_dependencies FOR DELETE USING (EXISTS (
    SELECT 1 FROM tasks WHERE tasks.id = task_dependencies.task_id AND tasks.user_id = auth.uid()
  ));

-- ===========================
-- 5. GOALS
-- ===========================
CREATE TABLE IF NOT EXISTS goals (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_date DATE,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);

ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own goals"
  ON goals FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own goals"
  ON goals FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own goals"
  ON goals FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own goals"
  ON goals FOR DELETE USING (user_id = auth.uid());

-- Task-Goal junction
CREATE TABLE IF NOT EXISTS task_goals (
  id BIGSERIAL PRIMARY KEY,
  task_id BIGINT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  goal_id BIGINT NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(task_id, goal_id)
);

CREATE INDEX IF NOT EXISTS idx_task_goals_task_id ON task_goals(task_id);
CREATE INDEX IF NOT EXISTS idx_task_goals_goal_id ON task_goals(goal_id);

ALTER TABLE task_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own task_goals"
  ON task_goals FOR SELECT USING (EXISTS (
    SELECT 1 FROM tasks WHERE tasks.id = task_goals.task_id AND tasks.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own task_goals"
  ON task_goals FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM tasks WHERE tasks.id = task_goals.task_id AND tasks.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own task_goals"
  ON task_goals FOR DELETE USING (EXISTS (
    SELECT 1 FROM tasks WHERE tasks.id = task_goals.task_id AND tasks.user_id = auth.uid()
  ));

-- ===========================
-- 6. TIME TRACKING
-- ===========================
CREATE TABLE IF NOT EXISTS time_entries (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id BIGINT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  duration_minutes INTEGER DEFAULT 0,
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_time_entries_user_id ON time_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_task_id ON time_entries(task_id);

ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own time entries"
  ON time_entries FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own time entries"
  ON time_entries FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own time entries"
  ON time_entries FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own time entries"
  ON time_entries FOR DELETE USING (user_id = auth.uid());

-- ===========================
-- 7. TASK NOTES
-- ===========================
CREATE TABLE IF NOT EXISTS task_notes (
  id BIGSERIAL PRIMARY KEY,
  task_id BIGINT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_task_notes_task_id ON task_notes(task_id);
CREATE INDEX IF NOT EXISTS idx_task_notes_user_id ON task_notes(user_id);

ALTER TABLE task_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own task notes"
  ON task_notes FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own task notes"
  ON task_notes FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own task notes"
  ON task_notes FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own task notes"
  ON task_notes FOR DELETE USING (user_id = auth.uid());

-- ===========================
-- 8. TASK TEMPLATES
-- ===========================
CREATE TABLE IF NOT EXISTS task_templates (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'Medium',
  category TEXT DEFAULT 'Personal',
  repeat_type TEXT DEFAULT 'None',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_task_templates_user_id ON task_templates(user_id);

ALTER TABLE task_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own task templates"
  ON task_templates FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own task templates"
  ON task_templates FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own task templates"
  ON task_templates FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own task templates"
  ON task_templates FOR DELETE USING (user_id = auth.uid());

-- ===========================
-- 9. TASK TEMPLATE SUBTASKS
-- ===========================
CREATE TABLE IF NOT EXISTS template_subtasks (
  id BIGSERIAL PRIMARY KEY,
  template_id BIGINT NOT NULL REFERENCES task_templates(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_template_subtasks_template_id ON template_subtasks(template_id);

ALTER TABLE template_subtasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own template subtasks"
  ON template_subtasks FOR SELECT USING (EXISTS (
    SELECT 1 FROM task_templates WHERE task_templates.id = template_subtasks.template_id AND task_templates.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own template subtasks"
  ON template_subtasks FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM task_templates WHERE task_templates.id = template_subtasks.template_id AND task_templates.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own template subtasks"
  ON template_subtasks FOR DELETE USING (EXISTS (
    SELECT 1 FROM task_templates WHERE task_templates.id = template_subtasks.template_id AND task_templates.user_id = auth.uid()
  ));
