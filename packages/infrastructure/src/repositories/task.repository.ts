import { PrismaClient } from '@prisma/client';
import { Task, CreateTaskInput, UpdateTaskInput, TaskWithProject } from '@commit-coach/domain/entities/task';
import { TaskRepository } from '@commit-coach/domain/repositories/task.repository';

export class PrismaTaskRepository implements TaskRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(input: CreateTaskInput): Promise<Task> {
    const task = await this.prisma.task.create({
      data: {
        title: input.title,
        description: input.description,
        priority: input.priority,
        status: input.status,
        dueDate: input.dueDate,
        projectId: input.projectId,
      },
    });

    return task;
  }

  async update(id: string, input: UpdateTaskInput): Promise<Task> {
    const task = await this.prisma.task.update({
      where: { id },
      data: {
        title: input.title,
        description: input.description,
        priority: input.priority,
        status: input.status,
        dueDate: input.dueDate,
        projectId: input.projectId,
      },
    });

    return task;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.task.delete({
      where: { id },
    });
  }

  async findById(id: string): Promise<Task | null> {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    return task;
  }

  async findAll(): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany();
    return tasks;
  }

  async findByProjectId(projectId: string): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      where: { projectId },
    });

    return tasks;
  }

  async findWithProject(id: string): Promise<TaskWithProject | null> {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        project: true,
      },
    });

    return task;
  }

  async updateStatus(id: string, status: Task['status']): Promise<Task> {
    const task = await this.prisma.task.update({
      where: { id },
      data: { status },
    });

    return task;
  }

  async updatePriority(id: string, priority: Task['priority']): Promise<Task> {
    const task = await this.prisma.task.update({
      where: { id },
      data: { priority },
    });

    return task;
  }
}
