# bff-project-template

Backend for Frontend 场景下的前端工程模板，基于 Next.js、TypeScript、TailwindCSS、shadcn/ui 风格组件和 pnpm 初始化。

## 技术栈

- 服务框架：Next.js App Router
- 开发语言：TypeScript
- 包管理：pnpm
- 样式方案：TailwindCSS
- 组件方案：shadcn/ui 风格组件
- 多语言：react-i18next、i18next
- 状态管理：Jotai
- 请求状态：TanStack React Query
- 新手引导：driver.js
- 工具包：es-toolkit、ahooks
- 代码规范：ESLint、Prettier
- 提交校验：Husky、lint-staged、commitlint

## 环境要求

- Node.js 22 或更高版本
- pnpm 10 或更高版本

```bash
node -v
pnpm -v
```

## 安装依赖

```bash
pnpm install
```

## 本地启动

```bash
pnpm dev
```

启动后访问：

```text
http://localhost:3000
```

## 生产构建与启动

```bash
pnpm build
pnpm start
```

## 常用命令

```bash
pnpm lint          # ESLint 检查
pnpm typecheck     # TypeScript 类型检查
pnpm format        # Prettier 格式化
pnpm format:check  # Prettier 格式检查
pnpm build         # 生产构建
```

## 环境变量

项目使用 `.env`、`.env.development`、`.env.production` 区分不同环境配置。

```bash
NEXT_PUBLIC_APP_NAME=bff-project-template
NEXT_PUBLIC_API_BASE_URL=/api
NEXT_PUBLIC_CDN_ORIGIN=https://cdn.example.com
```

说明：

- `NEXT_PUBLIC_APP_NAME`：应用名称。
- `NEXT_PUBLIC_API_BASE_URL`：接口基础路径。
- `NEXT_PUBLIC_CDN_ORIGIN`：生产环境 CDN 域名前缀。

当 `NODE_ENV=production` 且配置了 `NEXT_PUBLIC_CDN_ORIGIN` 时，Next.js 的 `/_next/static` 静态资源会通过 `assetPrefix` 自动拼接 CDN 前缀。

如果使用 `public` 目录下的静态资源，请通过 `src/lib/assets.ts` 中的 `assetUrl()` 获取路径，确保生产环境也能拼接 CDN 前缀。

## 页面说明

- `/`：欢迎页，展示工程模板简介和进入 demo 的入口。
- `/demo`：功能示例页，包含以下能力：

- 中文、英文多语言切换。
- 浅色、深色、跟随系统主题切换。
- 请求封装自动注入 `lang` 和 `theme` headers。
- driver.js 新手引导。
- Jotai、React Query、ahooks、es-toolkit 基础使用。

语言请求头规则：

- 默认中文时不写入 `headers.lang`。
- 切换为英文后写入 `headers.lang = en-US`。

主题请求头规则：

- 请求时根据当前解析后的主题写入 `headers.theme`。

## 提交规范

项目配置了 Husky、lint-staged 和 commitlint。

执行 `git commit` 时会自动：

- 对 staged 文件执行 ESLint 和 Prettier 检查/修复。
- 校验 commit message 是否符合 Conventional Commits 规范。

示例：

```bash
git commit -m "feat: init frontend template"
git commit -m "fix: update request headers"
git commit -m "docs: update readme"
```

## 目录说明

```text
src/app              Next.js App Router 入口
src/components/ui    shadcn/ui 风格基础组件
src/core             全局状态等核心代码
src/i18n             多语言初始化
src/lib              通用工具、请求封装、静态资源路径工具
```
