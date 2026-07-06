# AGENTS.md

这个仓库是一个面向 BFF 场景的 Next.js 前端模板。

## 技术栈

- 框架：Next.js
- 语言：TypeScript
- 包管理：pnpm
- 路由：App Router
- 组件：shadcn/ui 风格组件
- 样式：TailwindCSS
- 多语言：react-i18next、i18next
- 状态管理：Jotai
- 请求状态：TanStack React Query
- 新手引导：driver.js
- 工具库：es-toolkit、ahooks
- 规范：ESLint、Prettier
- 提交校验：Husky、lint-staged、commitlint

## 项目结构

- `src/app` 放置 App Router 路由、布局、providers 和全局样式。
- `src/components/ui` 放置 shadcn/ui 风格的基础组件。
- `src/core` 放置共享状态和应用级逻辑。
- `src/i18n` 放置多语言初始化和翻译资源。
- `src/lib` 放置通用工具，例如请求封装和静态资源路径工具。

## 常用命令

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm format
pnpm format:check
```

## 工作规则

- 依赖和脚本统一使用 `pnpm`。
- 保持 `package.json` 和 `pnpm-lock.yaml` 一致。
- 文件修改优先使用 `apply_patch`。
- 变更范围尽量贴合当前请求，不要扩散到无关内容。
- 在完成较大修改前，执行 `pnpm lint`、`pnpm typecheck`、`pnpm format:check` 和 `pnpm build`。

## 前端说明

- 项目使用 Next.js App Router，并在开发和生产构建中显式使用 webpack。
- 功能示例页位于 `/demo`，首页 `/` 是简洁欢迎页。
- 语言和主题状态通过 app providers 与 localStorage 进行共享。
- 生产环境下的静态资源继续沿用 `src/lib/assets.ts` 和 `next.config.ts` 中的 CDN 感知方案。

## 提交流程

- pre-commit 会运行 `lint-staged`。
- commit message 会通过 `commitlint` 校验。
- 提交信息遵循 Conventional Commits，例如 `feat: add demo page`。
