---
id: api
title: REST & WebSocket API
owner: o3
stakeholders: [cursor]
auth: "Bearer JWT"
common_headers:
  - Authorization
  - Content-Type
rate_limit:
  authenticated: "100/15m"
  guest: "20/15m"
endpoints:
  auth:
    - name: login
      method: POST
      path: /api/v1/auth/login
      req: { email: string, password: string }
      res: { user: User, token: string }
    - name: signup
      method: POST
      path: /api/v1/auth/signup
      req: { email: string, password: string, name: string }
      res: { user: User, token: string }
  projects:
    - name: listProjects
      method: GET
      path: /api/v1/projects
      query: { page?: int, limit?: int, status?: ProjectStatus }
      res: { data: Project[], pagination: Pagination }
    - name: createProject
      method: POST
      path: /api/v1/projects
      req: { name: string, description?: string }
      res: Project
  tasks:
    - name: listTasks
      method: GET
      path: /api/v1/tasks
      query: { projectId: UUID!, status?: TaskStatus, priority?: TaskPriority }
      res: Task[]
    - name: createTask
      method: POST
      path: /api/v1/tasks
      req: { projectId: UUID!, title: string, description?: string, priority?: TaskPriority, dueDate?: ISODate }
      res: Task
  ai:
    - name: coach
      method: POST
      path: /api/v1/ai/coach
      req: { taskId: UUID!, message: string }
      res: { reply: string, nextSteps: string[] }
errors:
  AUTH_001: "Authentication failed"
  AUTH_002: "Authorization failed"
  VAL_001: "Validation error"
  SRV_001: "Internal server error"
---

# API Notes

上記エンドポイントは Supabase Edge Functions でホストし、全レスポンスは ApiResponse<T> ラッパを介して返却します。Pagination オブジェクト仕様とエラーハンドリング戦略は architecture.spec.md で定義した標準に従います。