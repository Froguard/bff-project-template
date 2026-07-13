# 前端说明与提交流程

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
