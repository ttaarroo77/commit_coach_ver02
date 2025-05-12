"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authUserSchema = exports.updateUserSchema = exports.createUserSchema = exports.userSchema = exports.UserRole = void 0;
var zod_1 = require("zod");
/**
 * ユーザーロールの列挙型
 */
var UserRole;
(function (UserRole) {
    UserRole["USER"] = "user";
    UserRole["ADMIN"] = "admin";
    UserRole["TEAM_LEAD"] = "team_lead";
})(UserRole || (exports.UserRole = UserRole = {}));
/**
 * ユーザーのスキーマ定義
 */
exports.userSchema = zod_1.z.object({
    id: zod_1.z.string(),
    email: zod_1.z.string().email(),
    name: zod_1.z.string(),
    role: zod_1.z.nativeEnum(UserRole),
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime(),
});
/**
 * ユーザー作成のスキーマ定義
 */
exports.createUserSchema = exports.userSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
/**
 * ユーザー更新のスキーマ定義
 */
exports.updateUserSchema = exports.createUserSchema.partial();
/**
 * 認証ユーザーのスキーマ定義
 */
exports.authUserSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
});
