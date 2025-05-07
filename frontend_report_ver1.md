もしディレクトリ構造を動的にする場合、すなわちプロジェクトページを足せるようにしたい場合、どのようなファイルをどうすべきか、以下のレポートをアップデートしなさい。

https://github.com/ttaarroo77/commit_coach_ver02/tree/feature/task-list-implementation


# プロジェクトページ動的化設計メモ

## 目的
- プロジェクト（例: ウェブアプリ開発、モバイルアプリ開発、デザインプロジェクト）を「静的配列」ではなく、DBやAPI経由で動的に管理・追加できるようにする。
- サイドバーやプロジェクト詳細ページも動的に生成・遷移できるようにする。

---

## 必要なファイル・コード群

1. **API/DB連携用フック・API**
   - `apps/frontend/src/hooks/useProjects.ts`（SupabaseやAPI経由でプロジェクト一覧を取得・追加・削除）
   - `apps/frontend/src/app/api/projects/route.ts`（API Route: Next.js API or Edge Functions）

2. **動的ルーティングページ**
   - `apps/frontend/src/app/projects/[id]/page.tsx`（各プロジェクトの詳細ページ。`[id]`はプロジェクトID）
   - `apps/frontend/src/app/projects/page.tsx`（プロジェクト一覧ページ）

3. **サイドバーの動的化**
   - `apps/frontend/src/components/sidebar.tsx`（プロジェクトリストをuseProjectsから取得し、mapで描画）

4. **型定義**
   - `apps/frontend/src/types/project.ts`（Project型の定義。id, name, color, ...）

---

## catコマンド例

```sh
cat apps/frontend/src/hooks/useProjects.ts
cat apps/frontend/src/app/projects/[id]/page.tsx
cat apps/frontend/src/app/projects/page.tsx
cat apps/frontend/src/components/sidebar.tsx
cat apps/frontend/src/types/project.ts
```

---

## 修正必須ポイント（ctrl + I 指摘箇所）

- **Sidebarのプロジェクトリスト（静的配列）**
  - 現状：
    ```ts
    const [projects, setProjects] = useState([
      { id: "web-app", name: "ウェブアプリ開発", ... }, ...
    ])
    ```
  - **修正必須：useProjectsフックでDB/APIから取得し、setProjectsは不要。mapで描画。**

- **プロジェクト追加・削除のUI/ロジック**
  - サイドバーや一覧ページで「新しいプロジェクト」ボタン→useProjectsのcreateProjectを呼ぶ
  - 削除も同様にdeleteProjectを呼ぶ

- **[id]/page.tsxの動的取得**
  - useParamsやrouterでidを取得し、useProjectでDB/APIから詳細データを取得

---

## 考えられる実装方法

1. **Sidebarの修正**
   - useProjects()でプロジェクト一覧を取得し、mapで描画
   - 静的配列は削除

2. **プロジェクト追加・削除**
   - サイドバーや一覧ページに「新しいプロジェクト」ボタンを設置
   - フォーム送信でuseProjectsのcreateProjectを呼ぶ

3. **動的ルーティング**
   - `/projects/[id]/page.tsx`を作成し、useParamsでidを取得
   - useProject(id)で詳細データを取得し表示

4. **型定義の統一**
   - Project型を`src/types/project.ts`で一元管理

---

## まとめ
- サイドバー・プロジェクトページの静的配列を廃止し、DB/API経由の動的取得に切り替える
- 必要なファイル・修正箇所・catコマンド例を上記にまとめた
- ctrl + I 指摘箇所（Sidebarの静的配列）は**絶対修正必須** 


### 参考情報： commit-coach/apps/frontend におけるディレクトリ構造のtree

nakazawatarou@nakazawatarounoMacBook-Air frontend % tree -L 4
.
├── __tests__
│   ├── components
│   │   ├── ai-chat.test.tsx
│   │   ├── dashboard
│   │   │   ├── clock.test.tsx
│   │   │   ├── Dashboard.test.tsx
│   │   │   ├── mini-calendar.test.tsx
│   │   │   └── task-summary-card.test.tsx
│   │   ├── projects
│   │   │   ├── kanban-board.test.tsx
│   │   │   ├── kanban-column.test.tsx
│   │   │   ├── project-details.test.tsx
│   │   │   ├── project-form.test.tsx
│   │   │   ├── project-list.test.tsx
│   │   │   ├── task-card.test.tsx
│   │   │   ├── task-detail-modal.test.tsx
│   │   │   ├── task-form-modal.test.tsx
│   │   │   ├── task-menu.test.tsx
│   │   │   └── task-modal.test.tsx
│   │   └── ui
│   │       ├── badge.test.tsx
│   │       ├── button.test.tsx
│   │       ├── card.test.tsx
│   │       └── sidebar.test.tsx
│   ├── hooks
│   │   ├── useAuth.test.tsx
│   │   └── useProject.test.ts
│   └── test-utils.tsx
├── components
│   └── dashboard
│       └── Dashboard.tsx
├── contexts
│   └── AuthContext.tsx
├── jest.config.js
├── jest.setup.js
├── lib
│   └── supabase.ts
├── middleware.ts
├── next-env.d.ts
├── next.config.js
├── next.config.mjs
├── node_modules
│   ├── @babel
│   │   ├── core -> ../../../../node_modules/.pnpm/@babel+core@7.27.1/node_modules/@babel/core
│   │   ├── plugin-syntax-jsx -> ../../../../node_modules/.pnpm/@babel+plugin-syntax-jsx@7.27.1_@babel+core@7.27.1/node_modules/@babel/plugin-syntax-jsx
│   │   ├── preset-env -> ../../../../node_modules/.pnpm/@babel+preset-env@7.27.1_@babel+core@7.27.1/node_modules/@babel/preset-env
│   │   ├── preset-react -> ../../../../node_modules/.pnpm/@babel+preset-react@7.27.1_@babel+core@7.27.1/node_modules/@babel/preset-react
│   │   └── preset-typescript -> ../../../../node_modules/.pnpm/@babel+preset-typescript@7.27.1_@babel+core@7.27.1/node_modules/@babel/preset-typescript
│   ├── @commitlint
│   │   ├── cli -> ../../../../node_modules/.pnpm/@commitlint+cli@19.8.0_@types+node@20.17.32_typescript@5.8.3/node_modules/@commitlint/cli
│   │   └── config-conventional -> ../../../../node_modules/.pnpm/@commitlint+config-conventional@19.8.0/node_modules/@commitlint/config-conventional
│   ├── @dnd-kit
│   │   ├── core -> ../../../../node_modules/.pnpm/@dnd-kit+core@6.3.1_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/@dnd-kit/core
│   │   ├── sortable -> ../../../../node_modules/.pnpm/@dnd-kit+sortable@10.0.0_@dnd-kit+core@6.3.1_react-dom@18.3.1_react@18.3.1__react@18.3.1__react@18.3.1/node_modules/@dnd-kit/sortable
│   │   └── utilities -> ../../../../node_modules/.pnpm/@dnd-kit+utilities@3.2.2_react@18.3.1/node_modules/@dnd-kit/utilities
│   ├── @hello-pangea
│   │   └── dnd -> ../../../../node_modules/.pnpm/@hello-pangea+dnd@18.0.1_@types+react@18.3.20_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/@hello-pangea/dnd
│   ├── @hookform
│   │   └── resolvers -> ../../../../node_modules/.pnpm/@hookform+resolvers@5.0.1_react-hook-form@7.56.1_react@18.3.1_/node_modules/@hookform/resolvers
│   ├── @radix-ui
│   │   ├── react-avatar -> ../../../../node_modules/.pnpm/@radix-ui+react-avatar@1.1.7_@types+react-dom@18.3.7_@types+react@18.3.20__@types+react@18.3._quydn7qit53npyli2jpc6xnvee/node_modules/@radix-ui/react-avatar
│   │   ├── react-dialog -> ../../../../node_modules/.pnpm/@radix-ui+react-dialog@1.1.11_@types+react-dom@18.3.7_@types+react@18.3.20__@types+react@18.3_a4fiysw5vsm35o3pdbuhwslc34/node_modules/@radix-ui/react-dialog
│   │   ├── react-dropdown-menu -> ../../../../node_modules/.pnpm/@radix-ui+react-dropdown-menu@2.1.12_@types+react-dom@18.3.7_@types+react@18.3.20__@types+rea_m2ch63k2xfwzlr7zy7rv7agirm/node_modules/@radix-ui/react-dropdown-menu
│   │   ├── react-label -> ../../../../node_modules/.pnpm/@radix-ui+react-label@2.1.4_@types+react-dom@18.3.7_@types+react@18.3.20__@types+react@18.3.2_p6bgyjkoyg2fczltes2bmrgbxe/node_modules/@radix-ui/react-label
│   │   ├── react-popover -> ../../../../node_modules/.pnpm/@radix-ui+react-popover@1.1.11_@types+react-dom@18.3.7_@types+react@18.3.20__@types+react@18._znojrqutfipebybz5bdtih3ple/node_modules/@radix-ui/react-popover
│   │   ├── react-select -> ../../../../node_modules/.pnpm/@radix-ui+react-select@2.2.2_@types+react-dom@18.3.7_@types+react@18.3.20__@types+react@18.3._37d4t6fru4y6uooiqep5qom7ye/node_modules/@radix-ui/react-select
│   │   ├── react-slot -> ../../../../node_modules/.pnpm/@radix-ui+react-slot@1.2.0_@types+react@18.3.20_react@18.3.1/node_modules/@radix-ui/react-slot
│   │   └── react-tabs -> ../../../../node_modules/.pnpm/@radix-ui+react-tabs@1.1.9_@types+react-dom@18.3.7_@types+react@18.3.20__@types+react@18.3.20_4exr65cdmvudhdpsvj6fvhqg4u/node_modules/@radix-ui/react-tabs
│   ├── @supabase
│   │   ├── ssr -> ../../../../node_modules/.pnpm/@supabase+ssr@0.6.1_@supabase+supabase-js@2.49.4/node_modules/@supabase/ssr
│   │   └── supabase-js -> ../../../../node_modules/.pnpm/@supabase+supabase-js@2.49.4/node_modules/@supabase/supabase-js
│   ├── @tanstack
│   │   └── react-query -> ../../../../node_modules/.pnpm/@tanstack+react-query@5.75.1_react@18.3.1/node_modules/@tanstack/react-query
│   ├── @testing-library
│   │   ├── jest-dom -> ../../../../node_modules/.pnpm/@testing-library+jest-dom@6.6.3/node_modules/@testing-library/jest-dom
│   │   ├── react -> ../../../../node_modules/.pnpm/@testing-library+react@16.3.0_@testing-library+dom@10.4.0_@types+react-dom@18.3.7_@types+reac_o437dcodmykkcpcisjkae7lilu/node_modules/@testing-library/react
│   │   └── user-event -> ../../../../node_modules/.pnpm/@testing-library+user-event@14.6.1_@testing-library+dom@10.4.0/node_modules/@testing-library/user-event
│   ├── @types
│   │   ├── jest -> ../../../../node_modules/.pnpm/@types+jest@29.5.14/node_modules/@types/jest
│   │   ├── js-cookie -> ../../../../node_modules/.pnpm/@types+js-cookie@3.0.6/node_modules/@types/js-cookie
│   │   └── supertest -> ../../../../node_modules/.pnpm/@types+supertest@6.0.3/node_modules/@types/supertest
│   ├── @typescript-eslint
│   │   ├── eslint-plugin -> ../../../../node_modules/.pnpm/@typescript-eslint+eslint-plugin@6.21.0_@typescript-eslint+parser@6.21.0_eslint@8.57.1_typesc_72by5ixpetiliatxx45p6nnyn4/node_modules/@typescript-eslint/eslint-plugin
│   │   └── parser -> ../../../../node_modules/.pnpm/@typescript-eslint+parser@6.21.0_eslint@8.57.1_typescript@5.8.3/node_modules/@typescript-eslint/parser
│   ├── buffer -> ../../../node_modules/.pnpm/buffer@6.0.3/node_modules/buffer
│   ├── class-variance-authority -> ../../../node_modules/.pnpm/class-variance-authority@0.7.1/node_modules/class-variance-authority
│   ├── clsx -> ../../../node_modules/.pnpm/clsx@2.1.1/node_modules/clsx
│   ├── cmdk -> ../../../node_modules/.pnpm/cmdk@1.1.1_@types+react-dom@18.3.7_@types+react@18.3.20__@types+react@18.3.20_react-dom@18.3._mwbrq57x4hsoi53kksdpwqe3km/node_modules/cmdk
│   ├── date-fns -> ../../../node_modules/.pnpm/date-fns@4.1.0/node_modules/date-fns
│   ├── eslint -> ../../../node_modules/.pnpm/eslint@8.57.1/node_modules/eslint
│   ├── eslint-config-prettier -> ../../../node_modules/.pnpm/eslint-config-prettier@9.1.0_eslint@8.57.1/node_modules/eslint-config-prettier
│   ├── eslint-plugin-prettier -> ../../../node_modules/.pnpm/eslint-plugin-prettier@5.2.6_@types+eslint@9.6.1_eslint-config-prettier@9.1.0_eslint@8.57.1___sqcmzi2ampxveueohcrfwzdexe/node_modules/eslint-plugin-prettier
│   ├── husky -> ../../../node_modules/.pnpm/husky@9.1.7/node_modules/husky
│   ├── jest -> ../../../node_modules/.pnpm/jest@29.7.0_@types+node@20.17.32_ts-node@10.9.2_@types+node@20.17.32_typescript@5.8.3_/node_modules/jest
│   ├── jest-environment-jsdom -> ../../../node_modules/.pnpm/jest-environment-jsdom@29.7.0/node_modules/jest-environment-jsdom
│   ├── js-cookie -> ../../../node_modules/.pnpm/js-cookie@3.0.5/node_modules/js-cookie
│   ├── jsdom -> ../../../node_modules/.pnpm/jsdom@26.1.0/node_modules/jsdom
│   ├── lucide-react -> ../../../node_modules/.pnpm/lucide-react@0.507.0_react@18.3.1/node_modules/lucide-react
│   ├── next -> ../../../node_modules/.pnpm/next@15.3.1_@babel+core@7.27.1_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next
│   ├── prettier -> ../../../node_modules/.pnpm/prettier@3.5.3/node_modules/prettier
│   ├── process -> ../../../node_modules/.pnpm/process@0.11.10/node_modules/process
│   ├── react -> ../../../node_modules/.pnpm/react@18.3.1/node_modules/react
│   ├── react-dom -> ../../../node_modules/.pnpm/react-dom@18.3.1_react@18.3.1/node_modules/react-dom
│   ├── stream-browserify -> ../../../node_modules/.pnpm/stream-browserify@3.0.0/node_modules/stream-browserify
│   ├── supertest -> ../../../node_modules/.pnpm/supertest@7.1.0/node_modules/supertest
│   ├── swr -> ../../../node_modules/.pnpm/swr@2.3.3_react@18.3.1/node_modules/swr
│   ├── tailwind-merge -> ../../../node_modules/.pnpm/tailwind-merge@3.2.0/node_modules/tailwind-merge
│   ├── tailwindcss-animate -> ../../../node_modules/.pnpm/tailwindcss-animate@1.0.7_tailwindcss@3.3.0_postcss@8.4.31_ts-node@10.9.2_@types+node@20.17.32_typescript@5.8.3__/node_modules/tailwindcss-animate
│   ├── ts-jest -> ../../../node_modules/.pnpm/ts-jest@29.3.2_@babel+core@7.27.1_@jest+transform@29.7.0_@jest+types@29.6.3_babel-jest@29.7.0_4bsapag6pqlyuk2dlbcgpu3nsm/node_modules/ts-jest
│   ├── turbo -> ../../../node_modules/.pnpm/turbo@1.13.4/node_modules/turbo
│   ├── util -> ../../../node_modules/.pnpm/util@0.12.5/node_modules/util
│   ├── vitest -> ../../../node_modules/.pnpm/vitest@3.1.2_@types+node@20.17.32_happy-dom@13.10.1_jsdom@26.1.0_terser@5.39.0/node_modules/vitest
│   └── zod -> ../../../node_modules/.pnpm/zod@3.24.3/node_modules/zod
├── package.json
├── postcss.config.js
├── public
│   ├── placeholder-logo.png
│   ├── placeholder-logo.svg
│   ├── placeholder-user.jpg
│   ├── placeholder.jpg
│   └── placeholder.svg
├── README.md
├── src
│   ├── __tests__
│   │   └── test-utils.tsx
│   ├── app
│   │   ├── api
│   │   │   ├── dashboard
│   │   │   └── tasks
│   │   ├── dashboard
│   │   │   ├── page-patch.tsx
│   │   │   ├── page.tsx
│   │   │   └── page.tsx.bak
│   │   ├── forgot-password
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── login
│   │   │   └── page.tsx
│   │   ├── logout
│   │   │   └── page.tsx
│   │   ├── mypage
│   │   │   └── page.tsx
│   │   ├── not-found.tsx
│   │   ├── page.tsx
│   │   ├── projects
│   │   │   ├── [id]
│   │   │   ├── design
│   │   │   ├── mobile-app
│   │   │   ├── new
│   │   │   ├── page.tsx
│   │   │   ├── pages.tsx
│   │   │   ├── project-template.tsx
│   │   │   ├── ProjectForm.tsx
│   │   │   └── web-app
│   │   ├── register
│   │   │   └── page.tsx
│   │   ├── reset-password
│   │   │   └── page.tsx
│   │   └── settings
│   │       └── page.tsx
│   ├── components
│   │   ├── ai-chat.tsx
│   │   ├── auth
│   │   │   ├── login-form.tsx
│   │   │   ├── logout-button.tsx
│   │   │   ├── password-reset-form.tsx
│   │   │   ├── register-form.tsx
│   │   │   └── reset-password-form.tsx
│   │   ├── dashboard
│   │   │   ├── AddToDashboardButton.tsx
│   │   │   ├── ai-chat.tsx
│   │   │   ├── clock.tsx
│   │   │   ├── dashboard-content.tsx
│   │   │   ├── dashboard.tsx
│   │   │   ├── editable-text.tsx
│   │   │   ├── mini-calendar.tsx
│   │   │   ├── sortable-task-item.tsx
│   │   │   ├── task-board.tsx
│   │   │   ├── task-column.tsx
│   │   │   ├── task-form-modal.tsx
│   │   │   ├── task-group.tsx
│   │   │   ├── task-item.tsx
│   │   │   ├── task-list-item.tsx
│   │   │   ├── task-list.tsx
│   │   │   └── task-summary-card.tsx
│   │   ├── date-picker.tsx
│   │   ├── icons.tsx
│   │   ├── layout
│   │   │   ├── client-layout.tsx
│   │   │   └── header.tsx
│   │   ├── projects
│   │   │   ├── kanban-board.tsx
│   │   │   ├── kanban-column.tsx
│   │   │   ├── project-details.tsx
│   │   │   ├── project-form.tsx
│   │   │   ├── project-list.tsx
│   │   │   ├── subtask-list.tsx
│   │   │   ├── task-card.tsx
│   │   │   ├── task-detail-modal.tsx
│   │   │   ├── task-filters.tsx
│   │   │   ├── task-form-modal.tsx
│   │   │   ├── task-list.tsx
│   │   │   ├── task-menu.tsx
│   │   │   └── task-status.tsx
│   │   ├── sidebar.tsx
│   │   ├── task-breakdown.tsx
│   │   ├── task-item.tsx
│   │   ├── tasks
│   │   │   ├── task-details.tsx
│   │   │   ├── task-form.tsx
│   │   │   └── task-list.tsx
│   │   ├── theme-provider.tsx
│   │   └── ui
│   │       ├── accordion.tsx
│   │       ├── alert-dialog.tsx
│   │       ├── alert.tsx
│   │       ├── aspect-ratio.tsx
│   │       ├── avatar.tsx
│   │       ├── badge.tsx
│   │       ├── breadcrumb.tsx
│   │       ├── button.tsx
│   │       ├── calendar.tsx
│   │       ├── card.tsx
│   │       ├── carousel.tsx
│   │       ├── chart.tsx
│   │       ├── checkbox.tsx
│   │       ├── collapsible.tsx
│   │       ├── command.tsx
│   │       ├── context-menu.tsx
│   │       ├── dialog.tsx
│   │       ├── drawer.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── error-message.tsx
│   │       ├── form.tsx
│   │       ├── hover-card.tsx
│   │       ├── input-otp.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── loading-spinner.tsx
│   │       ├── menubar.tsx
│   │       ├── navigation-menu.tsx
│   │       ├── pagination.tsx
│   │       ├── popover.tsx
│   │       ├── progress.tsx
│   │       ├── radio-group.tsx
│   │       ├── resizable.tsx
│   │       ├── scroll-area.tsx
│   │       ├── select.tsx
│   │       ├── separator.tsx
│   │       ├── sheet.tsx
│   │       ├── sidebar.tsx
│   │       ├── skeleton.tsx
│   │       ├── slider.tsx
│   │       ├── sonner.tsx
│   │       ├── switch.tsx
│   │       ├── table.tsx
│   │       ├── tabs.tsx
│   │       ├── textarea.tsx
│   │       ├── toast.tsx
│   │       ├── toaster.tsx
│   │       ├── toggle-group.tsx
│   │       ├── toggle.tsx
│   │       ├── tooltip.tsx
│   │       ├── use-mobile.tsx
│   │       └── use-toast.ts
│   ├── contexts
│   │   ├── auth-context.tsx
│   │   └── AuthProvider.tsx
│   ├── hooks
│   │   ├── use-auth.ts
│   │   ├── use-auth.tsx
│   │   ├── use-mobile.tsx
│   │   ├── use-tasks.ts
│   │   ├── use-toast.ts
│   │   ├── useAuth.ts
│   │   ├── useAuth.tsx
│   │   ├── useDashboardTasks.ts
│   │   ├── useProject.ts
│   │   ├── useProjects.ts
│   │   ├── useProjectTasks.ts
│   │   └── useTask.ts
│   ├── lib
│   │   ├── auth.ts
│   │   ├── dashboard-api.ts
│   │   ├── supabase.ts
│   │   └── utils.ts
│   ├── middleware.ts
│   ├── public
│   ├── styles
│   │   └── globals.css
│   └── types
│       ├── dashboard.ts
│       ├── index.ts
│       ├── project.ts
│       ├── react-beautiful-dnd.d.ts
│       └── task.ts
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── vitest.setup.ts

117 directories, 185 files
nakazawatarou@nakazawatarounoMacBook-Air frontend % 



## 参考情報:とりあえずみてほしいファイルの中身：

nakazawatarou@nakazawatarounoMacBook-Air commit_coach % cat apps/frontend/src/hooks/useProjects.ts
cat apps/frontend/src/app/projects/[id]/page.tsx
cat apps/frontend/src/app/projects/page.tsx
cat apps/frontend/src/components/sidebar.tsx
cat apps/frontend/src/types/project.ts
import { useState, useEffect } from 'react';
import { Project } from '../types/project';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useToast } from '../hooks/use-toast';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  // プロジェクト一覧取得
  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (error) setError(error);
    setProjects(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  // プロジェクト作成
  const createProject = async (project: Partial<Project>) => {
    setLoading(true);
    setError(null);
    try {
      const user = await supabase.auth.getUser();
      console.log('Current user:', user.data.user); // ユーザー情報を出力
      if (!user.data.user?.id) {
        console.error('ユーザーIDが取得できません');
        throw new Error('ユーザーIDが取得できません');
      }
      const { data, error } = await supabase
        .from('projects')
        .insert([{ ...project, owner_id: user.data.user.id }])
        .select();
      if (error) throw error;
      if (data) setProjects(prev => [...prev, ...data]);
      toast({ title: '成功', description: 'プロジェクトが作成されました' });
    } catch (err: any) {
      console.error('Project creation error:', err); // エラー詳細を出力
      setError(err);
      toast({ title: 'エラー', description: err.message || 'プロジェクトの作成に失敗しました', variant: 'destructive' });
      alert(err.message || 'プロジェクトの作成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // プロジェクト削除
  const deleteProject = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      setProjects(prev => prev.filter(p => p.id !== id));
      toast({ title: '成功', description: 'プロジェクトが削除されました' });
    } catch (err: any) {
      setError(err);
      toast({ title: 'エラー', description: err.message || 'プロジェクトの削除に失敗しました', variant: 'destructive' });
      alert(err.message || 'プロジェクトの削除に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return { projects, loading, error, createProject, deleteProject };
}

export default useProjects;zsh: no matches found: apps/frontend/src/app/projects/[id]/page.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import useProjects from "@/hooks/useProjects"
import Link from "next/link"
import { ProjectForm } from "./ProjectForm"

export default function ProjectsPage() {
   const { projects, loading, error, createProject, deleteProject } = useProjects()
   const [newName, setNewName] = useState("")
   const [newDesc, setNewDesc] = useState("")
   const [addLoading, setAddLoading] = useState(false)
   const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null)
   const [localError, setLocalError] = useState<string | null>(null)

   const handleAdd = async () => {
      if (!newName.trim()) {
         alert('プロジェクト名を入力してください。')
         return
      }
      setAddLoading(true)
      setLocalError(null)
      try {
         await createProject({ name: newName, description: newDesc })
         setNewName("")
         setNewDesc("")
      } catch (error) {
         console.error("Error creating project:", error)
         setLocalError("プロジェクトの作成に失敗しました。もう一度お試しください。")
      } finally {
         setAddLoading(false)
      }
   }

   const handleDelete = async (id: string) => {
      setDeleteLoadingId(id)
      setLocalError(null)
      try {
         await deleteProject(id)
      } catch (error) {
         console.error("Error deleting project:", error)
         setLocalError("プロジェクトの削除に失敗しました。もう一度お試しください。")
      } finally {
         setDeleteLoadingId(null)
      }
   }

   return (
      <div className="p-6 max-w-xl mx-auto">
         <h1 className="text-2xl font-bold mb-4">プロジェクト一覧</h1>
         <ProjectForm
            onAdd={handleAdd}
            loading={addLoading}
            newName={newName}
            setNewName={setNewName}
            newDesc={newDesc}
            setNewDesc={setNewDesc}
         />
         {(error || localError) && <div className="text-red-500 mb-2">{error?.message || localError}</div>}
         <ul className="space-y-2">
            {projects.map(project => (
               <li key={project.id} className="flex items-center justify-between border rounded px-3 py-2">
                  <div>
                     <Link href={`/projects/${project.id}`} className="font-semibold hover:underline">
                        {project.name}
                     </Link>
                     <div className="text-sm text-gray-500">{project.description}</div>
                  </div>
                  <Button
                     variant="destructive"
                     size="sm"
                     onClick={() => handleDelete(project.id)}
                     disabled={!!deleteLoadingId || addLoading}
                     aria-label={`プロジェクト「${project.name}」を削除`}
                  >
                     {deleteLoadingId === project.id ? '削除中...' : '削除'}
                  </Button>
               </li>
            ))}
         </ul>
      </div>
   )
} "use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Menu, X, ChevronDown, ChevronRight, Home, User, Settings, LogOut, Plus, CheckSquare, FolderKanban, Users, BarChart3 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

export function Sidebar() {
  // モバイルではデフォルトでサイドバーを閉じる
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePath, setActivePath] = useState(""); // 現在のパスを保存するステート
  const { user, signOut } = useAuth();
  const router = useRouter();

  // プロジェクトリストの状態
  const [projects, setProjects] = useState([
    {
      id: "web-app",
      name: "ウェブアプリ開発",
      color: "#31A9B8",
      href: "/projects/web-app",
    },
    {
      id: "mobile-app",
      name: "モバイルアプリ開発",
      color: "#258039",
      href: "/projects/mobile-app",
    },
    {
      id: "design",
      name: "デザインプロジェクト",
      color: "#F5BE41",
      href: "/projects/design",
    },we
  ])

  // 現在のURLからアクティブなプロジェクトを特定
  const [activeProject, setActiveProject] = useState("")

  // クライアントサイドでの初期化処理をまとめて実行
  useEffect(() => {
    // 現在のパスを取得
    setActivePath(window.location.pathname);

    // アクティブなプロジェクトを特定
    const path = window.location.pathname;
    const projectId = path.split("/projects/")[1];
    if (projectId) {
      setActiveProject(projectId);
    }

    // 画面サイズに応じてサイドバーの表示状態を調整
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    // 初期化時に一度実行
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  // ユーザー名の取得（メールアドレスの@より前の部分）
  const getUserName = () => {
    if (!user?.email) return 'User';
    return user.email.split('@')[0];
  };

  // イニシャルの取得（メールアドレスの最初の文字）
  const getInitials = () => {
    if (!user?.email) return 'U';
    return user.email.charAt(0).toUpperCase();
  };

  return (
    <>
      {/* サイドバー */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-56 transform bg-white border-r border-gray-100 transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:relative md:translate-x-0 md:w-56`}
      >
        <div className="flex h-full flex-col">
          {/* サイドバーヘッダー */}
          <div className="flex h-14 items-center justify-between px-4 py-2 border-b border-gray-100">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-[#31A9B8] text-white flex items-center justify-center text-xs font-medium">
                C
              </div>
              <span className="text-sm font-semibold text-gray-800">コミットコーチ</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* サイドバーコンテンツ */}
          <div className="flex-1 overflow-auto py-3">
            {/* プロジェクトセクション */}
            <div className="px-3 mb-2">
              <h2 className="text-xs font-semibold uppercase text-gray-500">プロジェクト</h2>
              <div className="flex justify-end">
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* マイプロジェクトセクション */}
            <div className="space-y-1 px-3">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <ChevronDown className="mr-2 h-4 w-4" />
                <span>マイプロジェクト</span>
              </Button>
              <div className="ml-4 space-y-1">
                {projects.map((project) => (
                  <Link key={project.id} href={project.href} className="block">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`w-full justify-start gap-2 ${activeProject === project.id ? `text-[${project.color}]` : "text-gray-700"
                        }`}
                    >
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: project.color }}></div>
                      <span>{project.name}</span>
                    </Button>
                  </Link>
                ))}
                <Button variant="ghost" size="sm" className="w-full justify-start text-gray-500">
                  <Plus className="mr-2 h-4 w-4" />
                  <span>新しいプロジェクト</span>
                </Button>
              </div>
            </div>

            {/* ナビゲーションリンク */}
            <div className="mt-auto px-3">
              <div className="space-y-1">
                <Link href="/dashboard" className="block">
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <Home className="mr-2 h-4 w-4" />
                    <span>ダッシュボード</span>
                  </Button>
                </Link>
                <Link href="/mypage" className="block">
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <User className="mr-2 h-4 w-4" />
                    <span>マイページ</span>
                  </Button>
                </Link>
                <Link href="/settings" className="block">
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>設定</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* サイドバーフッター */}
          <div className="border-t border-gray-100 px-3 py-2">
            <Link href="/" className="block">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <LogOut className="mr-2 h-4 w-4" />
                <span>ログアウト</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* モバイル用オーバーレイ */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden animate-fadeIn"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </>
  )
}
export interface Project {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
} %                                                                                                                                          
