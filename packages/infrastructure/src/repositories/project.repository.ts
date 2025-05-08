import { PrismaClient } from '@prisma/client';
import { Project, CreateProjectInput, UpdateProjectInput, ProjectWithStats } from '@commit-coach/domain/entities/project';
import { ProjectRepository } from '@commit-coach/domain/repositories/project.repository';

export class PrismaProjectRepository implements ProjectRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(input: CreateProjectInput): Promise<Project> {
    const project = await this.prisma.project.create({
      data: {
        name: input.name,
        description: input.description,
        type: input.type,
        status: input.status,
      },
    });

    return project;
  }

  async update(id: string, input: UpdateProjectInput): Promise<Project> {
    const project = await this.prisma.project.update({
      where: { id },
      data: {
        name: input.name,
        description: input.description,
        type: input.type,
        status: input.status,
      },
    });

    return project;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.project.delete({
      where: { id },
    });
  }

  async findById(id: string): Promise<Project | null> {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });

    return project;
  }

  async findAll(): Promise<Project[]> {
    const projects = await this.prisma.project.findMany();
    return projects;
  }

  async findWithStats(id: string): Promise<ProjectWithStats | null> {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        tasks: true,
      },
    });

    if (!project) {
      return null;
    }

    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter(task => task.status === 'COMPLETED').length;
    const inProgressTasks = project.tasks.filter(task => task.status === 'IN_PROGRESS').length;
    const todoTasks = project.tasks.filter(task => task.status === 'TODO').length;

    return {
      ...project,
      stats: {
        totalTasks,
        completedTasks,
        inProgressTasks,
        todoTasks,
      },
    };
  }

  async updateStatus(id: string, status: Project['status']): Promise<Project> {
    const project = await this.prisma.project.update({
      where: { id },
      data: { status },
    });

    return project;
  }

  async updateType(id: string, type: Project['type']): Promise<Project> {
    const project = await this.prisma.project.update({
      where: { id },
      data: { type },
    });

    return project;
  }
}
