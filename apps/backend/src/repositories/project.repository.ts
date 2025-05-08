import { ProjectRepository } from '@commit-coach/domain/repositories/project.repository';
import { Project, ProjectType, ProjectStatus } from '@commit-coach/domain/entities/project';
import { PrismaClient } from '@prisma/client';

export class ProjectRepositoryImpl implements ProjectRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const project = await this.prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        type: data.type,
        status: data.status,
      },
    });

    return {
      id: project.id,
      name: project.name,
      description: project.description,
      type: project.type as ProjectType,
      status: project.status as ProjectStatus,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  }

  async update(id: string, data: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Project> {
    const project = await this.prisma.project.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        type: data.type,
        status: data.status,
      },
    });

    return {
      id: project.id,
      name: project.name,
      description: project.description,
      type: project.type as ProjectType,
      status: project.status as ProjectStatus,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
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

    if (!project) {
      return null;
    }

    return {
      id: project.id,
      name: project.name,
      description: project.description,
      type: project.type as ProjectType,
      status: project.status as ProjectStatus,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  }

  async findAll(): Promise<Project[]> {
    const projects = await this.prisma.project.findMany();

    return projects.map(project => ({
      id: project.id,
      name: project.name,
      description: project.description,
      type: project.type as ProjectType,
      status: project.status as ProjectStatus,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    }));
  }

  async findWithStats(id: string): Promise<(Project & { stats: { total: number; completed: number; inProgress: number; todo: number } }) | null> {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        tasks: true,
      },
    });

    if (!project) {
      return null;
    }

    const stats = {
      total: project.tasks.length,
      completed: project.tasks.filter(task => task.status === 'COMPLETED').length,
      inProgress: project.tasks.filter(task => task.status === 'IN_PROGRESS').length,
      todo: project.tasks.filter(task => task.status === 'TODO').length,
    };

    return {
      id: project.id,
      name: project.name,
      description: project.description,
      type: project.type as ProjectType,
      status: project.status as ProjectStatus,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      stats,
    };
  }

  async updateStatus(id: string, status: ProjectStatus): Promise<Project> {
    const project = await this.prisma.project.update({
      where: { id },
      data: { status },
    });

    return {
      id: project.id,
      name: project.name,
      description: project.description,
      type: project.type as ProjectType,
      status: project.status as ProjectStatus,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  }

  async updateType(id: string, type: ProjectType): Promise<Project> {
    const project = await this.prisma.project.update({
      where: { id },
      data: { type },
    });

    return {
      id: project.id,
      name: project.name,
      description: project.description,
      type: project.type as ProjectType,
      status: project.status as ProjectStatus,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  }
}
