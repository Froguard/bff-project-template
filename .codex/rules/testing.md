# 质量与验证规则

## 提交前验证

- 尽可能只在提交前统一运行测试、Lint、类型检查、格式检查、构建及专项检查（如 `pnpm i18ncheck`)。
- 每次在提交代码修改之前，必须跑一遍 `pnpm test` 测试，全量通过才继续提交；如果只修改 `md` 等非代码文件或者 `./mocks` 等 mock 用的文件，则不需要跑 test 任务。
- 在完成较大修改前，执行 `pnpm test`、`pnpm lint`、`pnpm typecheck`、`pnpm format:check` 和 `pnpm build`。

## 测试实践

- 新增模块代码，除开 RSC 服务端组件不太方便做单元测试的之外，其余尽可能都加上对应的测试文件。
