## Phase 3: Infrastructure Layer Isolation
までで目指すべき構造：


commit_coach/
├ apps/                        # 外部公開向けランタイム＝薄いアダプタ層
│ ├ api/                      # ← 旧 apps/backend   : NestJS / Express など
│ │ ├ src/…
│ │ └ tsconfig.json
│ └ web/                      # ← 旧 apps/frontend : Next.js (App Router)
│   ├ src/…
│   └ next.config.mjs
│
├ packages/                    # ここから下が“再利用可能な純粋ロジック”
│ ├ domain/                   # ビジネスルール（Entity / VO / UseCase）
│ │ ├ src/
│ │ │ ├ entities/
│ │ │ ├ value-objects/
│ │ │ └ usecases/
│ │ ├ tests/
│ │ └ README.md               # 目的・公開 API の概要
│ ├ infrastructure/           # DB・外部 API・Supabase / Prisma など
│ │ ├ src/
│ │ ├ tests/
│ │ └ README.md
│ ├ ui/                       # Atomic Design + Storybook
│ │ ├ src/
│ │ ├ stories/
│ │ └ README.md
│ ├ shared-types/             # Zod / io-ts 生成型や共通 TS 型
│ │ └ src/
│ └ config/                   # ESLint / Prettier / Tailwind 共通設定
│   └ *.config.js
│
├ schema/                      # スキーマ駆動のソース・オブ・トゥルース
│ ├ openapi.yaml              # REST 用
│ ├ graphql/…                 # or *.graphql SDL
│ └ supabase/
│     ├ schema.sql
│     └ migrations/
│
├ docs/
│ ├ architecture.md           # 2 – 3 枚で読める全体図
│ ├ adr/                      # 意思決定ログ (Architecture Decision Records)
│ └ prompts/                  # LLM 用プロンプトテンプレ
│
├ .github/
│ ├ workflows/ci.yml
│ └ PULL_REQUEST_TEMPLATE.md
├ .husky/                     # commitlint, test, lint などをフック
├ pnpm-workspace.yaml
├ turbo.json                  # generate:types / build / test パイプライン
├ tsconfig.base.json          # ルート共通の strict 設定
└ README.md
