import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import { defaultLanguage } from "@/i18n/constants";

const resources = {
  "zh-CN": {
    translation: {
      actions: {
        startGuide: "开始引导",
      },
      app: {
        description:
          "这个页面演示了 i18n、主题、请求头注入、React Query、Jotai、driver.js、ahooks 和 es-toolkit 的基础集成。",
        kicker: "Next.js SPA Template",
        title: "BFF 前端工程模板",
      },
      home: {
        cta: "查看 Demo",
        description:
          "这是一个用于 BFF 项目的前端工程模板，已经预置常用工程能力和一个可运行的功能示例页面。",
        highlights: {
          engineering: {
            description:
              "Next.js、TypeScript、TailwindCSS、pnpm、ESLint、Prettier 和提交校验已完成集成。",
            title: "工程化基础",
          },
          i18n: {
            description: "Demo 页面内置中文和英文切换，并演示请求头 lang 注入规则。",
            title: "国际化示例",
          },
          theme: {
            description: "默认跟随系统主题，也支持主动切换浅色和深色模式。",
            title: "主题切换",
          },
        },
        kicker: "BFF Frontend Template",
        title: "欢迎使用 bff-project-template",
      },
      guide: {
        languageDescription: "切换后会持久化语言，并在非默认语言请求中写入 headers.lang。",
        languageTitle: "多语言切换",
        nextButton: "下一步",
        prevButton: "上一步",
        doneButton: "完成",
        requestDescription: "统一请求工具会读取当前语言和主题，并自动注入请求头。",
        requestTitle: "请求示例",
        themeDescription: "默认跟随系统，也可以主动选择浅色或深色主题。",
        themeTitle: "主题切换",
      },
      language: {
        current: "当前语言",
        description: "默认中文，切换到英文后请求会携带 lang。",
        title: "多语言",
      },
      request: {
        description: "点击按钮查看统一请求工具返回的模拟数据。",
        loading: "请求中...",
        run: "运行请求示例",
        title: "请求封装",
      },
      theme: {
        active: "当前解析主题：{{theme}}",
        dark: "深色",
        light: "浅色",
        pending: "主题加载中",
        system: "跟随系统",
        title: "主题",
      },
    },
  },
  "en-US": {
    translation: {
      actions: {
        startGuide: "Start guide",
      },
      app: {
        description:
          "This page demonstrates the baseline integration for i18n, theme switching, request headers, React Query, Jotai, driver.js, ahooks, and es-toolkit.",
        kicker: "Next.js SPA Template",
        title: "BFF Frontend Template",
      },
      home: {
        cta: "View demo",
        description:
          "This frontend template for BFF projects comes with common engineering defaults and a runnable feature demo.",
        highlights: {
          engineering: {
            description:
              "Next.js, TypeScript, TailwindCSS, pnpm, ESLint, Prettier, and commit checks are wired in.",
            title: "Engineering baseline",
          },
          i18n: {
            description:
              "The demo page includes Chinese and English switching, plus the lang request header rule.",
            title: "Internationalization",
          },
          theme: {
            description:
              "The theme follows the system preference by default and supports explicit light and dark modes.",
            title: "Theme switching",
          },
        },
        kicker: "BFF Frontend Template",
        title: "Welcome to bff-project-template",
      },
      guide: {
        languageDescription:
          "Language changes are persisted, and non-default language requests include headers.lang.",
        languageTitle: "Language switch",
        nextButton: "Next",
        prevButton: "Previous",
        doneButton: "Done",
        requestDescription:
          "The request utility reads the active language and theme, then injects headers automatically.",
        requestTitle: "Request demo",
        themeDescription:
          "The initial theme follows the system preference, with explicit light and dark choices.",
        themeTitle: "Theme switch",
      },
      language: {
        current: "Current language",
        description: "Chinese is the default. English requests include lang.",
        title: "Language",
      },
      request: {
        description: "Run a mocked request through the shared request utility.",
        loading: "Loading...",
        run: "Run request demo",
        title: "Request utility",
      },
      theme: {
        active: "Resolved theme: {{theme}}",
        dark: "Dark",
        light: "Light",
        pending: "Loading theme",
        system: "System",
        title: "Theme",
      },
    },
  },
};

if (!i18next.isInitialized) {
  void i18next.use(initReactI18next).init({
    defaultNS: "translation",
    fallbackLng: defaultLanguage,
    interpolation: {
      escapeValue: false,
    },
    lng: defaultLanguage,
    resources,
  });
}

export default i18next;
