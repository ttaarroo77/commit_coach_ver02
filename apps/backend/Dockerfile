FROM node:20-slim AS base

# ビルドステージ
FROM base AS builder
WORKDIR /app

# パッケージマネージャとして pnpm を使用
RUN npm install -g pnpm

# 依存関係のインストール
COPY package.json package-lock.json ./
RUN npm ci

# ソースコードのコピーとビルド
COPY . .
RUN npm run build

# 本番ステージ
FROM base AS runner
WORKDIR /app

# 本番環境変数の設定
ENV NODE_ENV=production

# 必要なパッケージのみをインストール
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ビルド済みのアプリケーションをコピー
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Prismaクライアントの生成
RUN npx prisma generate

# ヘルスチェック
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD node -e "const http = require('http'); const options = { hostname: 'localhost', port: process.env.PORT || 3001, path: '/api/health', timeout: 2000 }; const req = http.request(options, (res) => process.exit(res.statusCode === 200 ? 0 : 1)); req.on('error', () => process.exit(1)); req.end();"

# アプリケーションの起動
EXPOSE 3001
CMD ["node", "dist/index.js"]
