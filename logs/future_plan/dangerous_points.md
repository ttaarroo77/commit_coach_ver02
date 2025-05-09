## Phase 0 – 3 で“ハマりがち”な5 大ポイントと攻略ガイド

各セクションは

> **● 難所 / 罠** → **なぜ起きるか（理由）** → **クリアのコツ** → **具体的 Checklist**
> の4段構成で深掘りしています。

---

### 1. **名前解決まわりのループ地獄** ― `tsconfig` とパスエイリアス

**● 難所**

* ドメイン移動後に *import パスが壊れ*、`Cannot find module` や **循環参照** が大量発生。

**◆ 理由**

1. 既存コードが `../../…` 相対パスで相互参照している。
2. VS Code は `paths` 解決 & `pnpm` の `node_modules/.pnpm/*` を同時に見るため、置き換え途中のミスマッチが起きやすい。

**★ コツ**

* **“一度に切らずに** *コンパイルを割らない* 境界ごとの“移動→alias→commit” スプリント。
* `tsconfig.base.json` で **絶対パス alias** を早めに導入 (`@domain/*`, `@ui/*` など)。
* Turborepo の **incremental Build** (`dependsOn: ['^build']`) を活かし「壊れたら即検知」。

**☑ Checklist**

```text
### 1.1 パスエイリアス準備
[ ] tsconfig.base.json に "paths": { "@domain/*": ["packages/domain/src/*"] } を追加
[ ] eslint-import-resolver-typescript に同じ paths を同期
[ ] VSCode settings.json → "typescript.preferences.importModuleSpecifier":"non-relative"

### 1.2 段階移動
[ ] Entity フォルダ (models) を packages/domainへコピー ※まだ export しない
[ ] 旧 src/models/** を 'export * from "@domain/…" ' に差し替え commit
[ ] 旧フォルダを削除 → tsc が通ることを確認して commit
```

---

### 2. **Infrastructure 分離での “実行時エラー”** ― 環境変数 & 接続インスタンス

**● 難所**

* Supabase クライアントなどが **UI 層から直 import** されており、移動すると **undefined 接続**でクラッシュ。

**◆ 理由**

* “dotenv 直読み”が至る所に散在している
* React サーバー／ブラウザ双方で同じ util を使っており、SSR 時に `window` 参照で落ちる

**★ コツ**

1. \*\*「設定値を受け取るファクトリ」\*\*パターンに変更してから場所を移す

   ```ts
   // before
   export const supabase = createClient(
     process.env.NEXT_PUBLIC_SUPABASE_URL!,
     process.env.NEXT_PUBLIC_SUPABASE_KEY!
   );
   // after
   export const createSupabase = (url: string, key: string) =>
     createClient(url, key);
   ```
2. 移動と同時に **apps/web のエントリだけで new する**よう依存方向を一本化。
3. `.env.example` に必須キーを明示し、CI では `--require dotenv-flow/config` で統一読み込み。

**☑ Checklist**

```text
### 2.1 ファクトリ化
[ ] packages/infrastructure/src/supabase/client.ts に createSupabase を実装
[ ] apps/web/src/lib/supabase.ts で import { createSupabase } and instantiate
[ ] UI 直 import 箇所を修正して commit

### 2.2 環境値の一元化
[ ] .env.example へ SUPABASE_URL / KEY を追加
[ ] pnpm script "dev": "dotenv-vitest -- vitest"
```

---

### 3. **CI キャッシュ & Turborepo — “キャッシュは通るがテストが落ちる”**

**● 難所**

* Workspaces を追加した瞬間、**GitHub Actions の PNPM キャッシュ key** が変わりキャッシュミス。
* または Turborepo の **output 設定漏れ**で previous build artifact が欠落しテスト失敗。

**◆ 理由**

* `turbo.json` の `"outputs": ["dist/**"]` が新パッケージを拾っていない
* `actions/setup-node` + `pnpm-store` キャッシュ対象が `.pnpm-store` から `.local/share/pnpm/store` へ変わる差分を見落としがち

**★ コツ**

* **キャッシュ key = lockfile hash** という黄金パターンをベースに毎回 `pnpm store prune`。
* `turbo run lint test --filter=...` で **パッケージ単位**の失敗把握。
* 追加パッケージごとに必ず `outputs` を列挙（ワイルドカードより明示）。

**☑ Checklist**

```text
### 3.1 turbo outputs 更新
[ ] turbo.json pipeline.build.outputs に "packages/domain/dist/**" 等を追加
[ ] PR で new package 追加時 lint to fail if outputs missing (turbo-ignore)

### 3.2 CI キャッシュ最適化
[ ] ci.yml の restore-cache key: ${{ hashFiles('pnpm-lock.yaml') }}
[ ] run: pnpm install --frozen-lockfile
[ ] run: pnpm store prune
```

---

### 4. **テスト移管 & カバレッジ維持**

**● 難所**

* 旧 `__tests__` が `apps/*` に散在 → パス移動で **jest/vitest パス変換が壊れる**。
* カバレッジ閾値を設けたいのに **モノレポ全体で 80 %** を維持できずマージブロック。

**◆ 理由**

* Jest の `roots`, `moduleNameMapper` が単一ルート前提
* `vitest --coverage` はワークスペース単位で出力を分けないと全体集計が難

**★ コツ**

* **“パッケージごとに vitest.init()”**+ `vitest.workspace` 機能を利用し**個別 XML** を出力。
* Coveralls/Codecov 側で **パッケージ別閾値** を設定し「critical domain だけ 90 %」方式に。

**☑ Checklist**

```text
### 4.1 vitest 分割
[ ] packages/domain/vitest.config.ts を追加 (projectName: 'domain')
[ ] pnpm test -F @commit-coach/domain を CI マトリクスで回す

### 4.2 カバレッジ閾値
[ ] vitest config → coverage.threshold: { statements: 90 } (domain)
[ ] ci.yml → if coverage < threshold then fail
```

---

### 5. **“実行ファイル残骸”と旧ビルド Artefact の衝突**

**● 難所**

* `dist/` フォルダが Git 忽略前にコミットされており、**新ビルドが古いファイルをマージ** → 実行時に謎の古コード。

**◆ 理由**

* `apps/backend/dist` が Docker Build 用に残されている
* IDE からの “auto-save on format” で dist の `.map` が更新 → 変更検知される

**★ コツ**

* `.gitignore` を一時的に強制 (`!dist/`) して “古 artefact を削除” コミット。
* **Dockerfile をマルチステージ**に変え「COPY src → build inside container」で dist を不要に。

**☑ Checklist**

```text
### 5.1 dist 一掃
[ ] git rm -r apps/backend/dist packages/**/dist
[ ] echo '/dist' >> .gitignore && commit "chore: ignore build artefacts"

### 5.2 Dockerfile 修正
[ ] FROM node:20-alpine as builder
    WORKDIR /app
    COPY package*.json pnpm-lock.yaml ./
    RUN pnpm install --prod=false
    COPY . .
    RUN pnpm --filter @commit-coach/api build
[ ] FROM node:20-alpine
    COPY --from=builder /app/apps/api/dist /srv/app
```

---

## まとめ

* **最大の敵は「途中状態で壊れる依存関係」**。スプリントを細かく刻み“常にグリーン”を保つと心理的安全も確保できます。
* 移動・分離前に **パス alias / env 抽象 / CI キャッシュ** といった “基盤” を先に敷くのが Phase 0 – 1 の要。
* それぞれの難所に対して **チェック項目を明示** → 実際の PR テンプレートに貼り付けておくと運用がスムーズです。
