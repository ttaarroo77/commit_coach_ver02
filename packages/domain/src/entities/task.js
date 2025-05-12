"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTaskSchema = exports.createTaskSchema = exports.taskSchema = exports.TaskStatus = exports.TaskPriority = void 0;
var zod_1 = require("zod");
/**
 * タスクの優先度
 */
var TaskPriority;
(function (TaskPriority) {
    TaskPriority["LOW"] = "low";
    TaskPriority["MEDIUM"] = "medium";
    TaskPriority["HIGH"] = "high";
    TaskPriority["URGENT"] = "urgent";
})(TaskPriority || (exports.TaskPriority = TaskPriority = {}));
/**
 * タスクのステータス
 */
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["TODO"] = "todo";
    TaskStatus["IN_PROGRESS"] = "in_progress";
    TaskStatus["REVIEW"] = "review";
    TaskStatus["DONE"] = "done";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
/**
 * タスクのスキーマ定義
 */
exports.taskSchema = zod_1.z.object({
    id: zod_1.z.string(),
    title: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    status: zod_1.z.nativeEnum(TaskStatus),
    priority: zod_1.z.nativeEnum(TaskPriority),
    dueDate: zod_1.z.string().datetime(),
    projectId: zod_1.z.string(),
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime(),
});
/**
 * タスク作成のスキーマ定義
 */
exports.createTaskSchema = exports.taskSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
/**
 * タスク更新のスキーマ定義
 */
exports.updateTaskSchema = exports.createTaskSchema.partial();
