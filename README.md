# Studio Almost — 不周山设计作品集

React / TypeScript / vinext 网站，目前包含首页和六个作品分类落地页。

首页设计已于 **2026-11-12** 定稿。参见 [页面与模块地图](docs/PAGE-MODULE-MAP.zh-CN.md)、[素材数量与尺寸清单](docs/HOMEPAGE-ASSET-INVENTORY-2026-11-12.zh-CN.md)、[定稿备份与回滚说明](docs/HOMEPAGE-FINAL-BACKUP-2026-11-12.zh-CN.md)。固定备份分支为 `codex/homepage-final-2026-11-12`。

## 本地预览

使用 Node.js >=22.13.0 和 pnpm 11.22.0。沿用现有 pnpm 安装树，pnpm-lock.yaml 为依赖依据；package-lock.json 仅保留历史参考，请勿混用 npm install。

```powershell
pnpm install --frozen-lockfile
pnpm dev
```

打开 http://127.0.0.1:3000/，保持启动终端运行。端口被占用会明确报错，不会自动跳到另一个端口。首次启动需要完成编译，等待 Local 地址出现。

如果旧预览打不开，先确认开发服务仍在运行，并使用上述地址；Windows 上 localhost 可能解析为 IPv6，而 127.0.0.1 使用 IPv4。指定其他地址时使用 vinext 的 --hostname 参数（不是 --host）。

## 常用检查

- `pnpm lint`：代码规范检查。
- `pnpm typecheck`：TypeScript 类型检查。
- `pnpm test`：构建并验证首页、六个分类页和未知分类回退，共 10 项。
- `pnpm check`：依次执行全部检查。
- `pnpm build` / `pnpm start`：生产构建 / 本地生产预览。
- `pnpm db:generate`：修改数据库 schema 后生成迁移。

## 后续设计修改入口

| 内容 | 文件 |
| --- | --- |
| 首页结构、导航与交互状态 | app/page.tsx |
| 样式、字体、移动端规则 | app/globals.css |
| 首页与分类页共用分类数据 | app/content/categories.ts |
| 精选作品、能力数值、多语言标语 | app/content/home.ts |
| 36 座山、引语、坐标、地形参数 | app/content/mountains.ts |
| 山体生成与 WebGL 生命周期 | app/components/GenerativeCanvas.tsx |
| 标语解密动画 | app/components/LanguageDecryptedText.tsx |
| 六个分类页共用模板 | app/works/[slug]/page.tsx |
| 网站标题与分享信息 | app/layout.tsx |

先阅读 AGENTS.md、docs/PROJECT-STATE.md 和 docs/DESIGN-SYSTEM.md。内容与动画模块已拆分；既有 CSS 选择器和设计规则继续沿用。Three.js 通过独立模块加载；不支持 WebGL 时保留文字与导航。

## 当前限制

作品区仍使用 CSS 占位图，分类页尚未填入项目档案。分类英文名称沿用现有页面。检查中仍有三个 SVG 原生 img 提示及 Three.js 大文件提示；它们不阻止构建。

## Hosting

vite.config.ts 使用 Cloudflare 插件模拟运行环境；worker/index.ts 为 Worker 入口。build/sites-vite-plugin.ts 将 .openai/hosting.json 与迁移文件复制到构建结果。当前无 D1/R2 绑定，数据库接口仅作预留。

## Workspace Auth Headers

Signed-in visitors receive both `oai-authenticated-user-id` and `oai-authenticated-user-email`. Private Sites require every visitor to sign in; public Sites may also have anonymous visitors, for whom neither header is present.

The user ID is stable for the same user on the same Site and different across Sites. Email and name are intended for display or contact purposes.

SIWC-authenticated workspace sites may also receive
`oai-authenticated-user-full-name` when the user's SIWC profile has a non-empty
`name` claim. The full-name value is percent-encoded UTF-8 and is accompanied by
`oai-authenticated-user-full-name-encoding: percent-encoded-utf-8`.

Treat the full name as optional and fall back to email when it is absent:

```tsx
import { headers } from "next/headers";

export default async function Home() {
  const requestHeaders = await headers();
  const userId = requestHeaders.get("oai-authenticated-user-id");
  const email = requestHeaders.get("oai-authenticated-user-email");
  const encodedFullName = requestHeaders.get("oai-authenticated-user-full-name");
  const fullName =
    encodedFullName &&
    requestHeaders.get("oai-authenticated-user-full-name-encoding") ===
      "percent-encoded-utf-8"
      ? decodeURIComponent(encodedFullName)
      : null;

  const displayName = fullName ?? email;
  // ...
}
```

## Optional Dispatch-Owned ChatGPT Sign-In

Import the ready-to-use helpers from `app/chatgpt-auth.ts` when the site needs
optional or required ChatGPT sign-in:

- Use `getChatGPTUser()` for optional signed-in UI.
- Use `requireChatGPTUser(returnTo)` for server-rendered pages that should send
  anonymous visitors through Sign in with ChatGPT.
- Use `chatGPTSignInPath(returnTo)` and `chatGPTSignOutPath(returnTo)` for
  browser links or actions.
- Pass a same-origin relative `returnTo` path for the destination after sign-in
  or sign-out. The helper validates and safely encodes it.
- Mark protected pages with `export const dynamic = "force-dynamic"` because
  they depend on per-request identity headers.

Dispatch owns `/signin-with-chatgpt`, `/signout-with-chatgpt`, `/callback`, the
OAuth cookies, and identity header injection. Do not implement app routes for
those reserved paths. Routes that do not import and call the helper remain
anonymous-compatible.

SIWC establishes identity only; it does not prove workspace membership. Use the
Sites hosting platform's access policy controls for workspace-wide restrictions,
or enforce explicit server-side membership or allowlist checks.

Use SIWC for account pages, user-specific dashboards, saved records, and write
actions tied to the current ChatGPT user. Leave public content anonymous.
