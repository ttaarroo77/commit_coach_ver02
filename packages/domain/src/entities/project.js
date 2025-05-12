"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProjectSchema = exports.createProjectSchema = exports.projectSchema = exports.ProjectStatus = exports.ProjectType = void 0;
var zod_1 = require("zod");
/**
 * プロジェクトタイプの列挙型
 */
var ProjectType;
(function (ProjectType) {
    ProjectType["WEB_APP"] = "web_app";
    ProjectType["MOBILE_APP"] = "mobile_app";
    ProjectType["DESIGN"] = "design";
    ProjectType["BACKEND"] = "backend";
    ProjectType["FRONTEND"] = "frontend";
    ProjectType["FULLSTACK"] = "fullstack";
    ProjectType["OTHER"] = "other";
})(ProjectType || (exports.ProjectType = ProjectType = {}));
/**
 * プロジェクトのステータス
 */
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus["PLANNING"] = "planning";
    ProjectStatus["IN_PROGRESS"] = "in_progress";
    ProjectStatus["ON_HOLD"] = "on_hold";
    ProjectStatus["COMPLETED"] = "completed";
    ProjectStatus["ARCHIVED"] = "archived";
})(ProjectStatus || (exports.ProjectStatus = ProjectStatus = {}));
/**
 * プロジェクトのスキーマ定義
 */
exports.projectSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    type: zod_1.z.nativeEnum(ProjectType),
    status: zod_1.z.nativeEnum(ProjectStatus),
    startDate: zod_1.z.string().datetime().optional(),
    endDate: zod_1.z.string().datetime().optional(),
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime(),
});
/**
 * プロジェクト作成のスキーマ定義
 */
exports.createProjectSchema = exports.projectSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
/**
 * プロジェクト更新のスキーマ定義
 */
exports.updateProjectSchema = exports.createProjectSchema.partial();
