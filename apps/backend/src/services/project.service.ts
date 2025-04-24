import { createClient } from '@supabase/supabase-js';
import { Project, UpdateProject } from '../types/project.types';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
);

export class ProjectService {
  async createProject(project: Project) {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getProjectById(id: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async getProjectsByOwner(ownerId: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('ownerId', ownerId);

    if (error) throw error;
    return data;
  }

  async updateProject(id: string, updates: UpdateProject) {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteProject(id: string) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async addMember(projectId: string, userId: string) {
    const { data, error } = await supabase
      .from('projects')
      .update({
        members: supabase.raw('array_append(members, ?)', [userId])
      })
      .eq('id', projectId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async removeMember(projectId: string, userId: string) {
    const { data, error } = await supabase
      .from('projects')
      .update({
        members: supabase.raw('array_remove(members, ?)', [userId])
      })
      .eq('id', projectId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
} 