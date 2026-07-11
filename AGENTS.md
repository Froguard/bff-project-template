# AGENTS.md

这个仓库是一个面向 BFF 场景的 Next.js 前端工程

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
- 测试：Vitest、React Testing Library
- 规范：ESLint、Prettier
- 提交校验：Husky、lint-staged、commitlint

## 项目结构

- `src/app` 放置 App Router 路由、布局、providers 和全局样式。
- `src/components/ui` 放置 shadcn/ui 风格的基础组件。
- `src/core` 放置共享状态和应用级逻辑。
- `src/i18n` 放置多语言初始化和翻译资源。
- `src/lib` 放置通用工具，例如请求封装和静态资源路径工具。
- `src/test` 放置 Vitest 公共测试 setup。

## 常用命令

```bash
pnpm install
pnpm dev
pnpm mock
pnpm test
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
- 每次修改或新增代码时，同步检查相关注释是否需要更新或新增，确保注释准确、有效且不过期。
- 所有导出函数（包括默认导出的页面、布局和组件）都必须在声明前添加准确、有效的中文 JSDoc 注释。
- 每次新增的模块代码，除开 RSC 服务端组件不太方便做单元测试的之外，其余尽可能都加上对应的测试文件。
- 新增文件命名统一使用 kebab-case：仅允许小写字母、数字和横线连字符 `-`，不允许出现大写字母。仓库根目录中由工具或社区约定的固定文件名除外，例如 `README.md`、`AGENTS.md`。
- 每次在提交代码修改之前，必须跑一遍 `pnpm test` 测试，全量通过才继续提交；如果只修改 `md` 等非代码文件或者`./mocks` 等 mock 用的文件，则不需要跑 test 任务。
- 在完成较大修改前，执行 `pnpm test`、`pnpm lint`、`pnpm typecheck`、`pnpm format:check` 和 `pnpm build`。

## 接口约定

- `"/api/"` 开头的接口统一表示前端 client 侧依赖的服务接口，开发环境下由 `next.config.ts` 转发到 `mihawk` mockServer。
- `"/napi/"` 开头的接口统一表示本系统 Next.js nodeServer 对外提供的接口。

## 前端说明

- 项目使用 Next.js App Router，并在开发和生产构建中显式使用 webpack。
- 功能示例页位于 `/demo`，首页 `/` 是简洁欢迎页。
- 语言和主题状态通过 app providers 与 localStorage 进行共享。
- 生产环境下的静态资源继续沿用 `src/lib/assets.ts` 和 `next.config.ts` 中的 CDN 感知方案。
- 本地开发时需要同时启动 `pnpm dev` 和 `pnpm mock`，分别负责 Next.js server 和 `mihawk` mockServer。
- MockServer 使用说明见 [./mocks/README.md](./mocks/README.md)。

## 提交流程

- pre-commit 会运行 `lint-staged`。
- commit message 会通过 `commitlint` 校验。
- 提交信息遵循 Conventional Commits，例如 `feat: add demo page`。
