"use strict";
import fs from "fs";
import path from "path";
import { randomUUID } from "node:crypto";
import Compose from "koa-compose";
import Router from "@koa/router";
// import type { Context: KoaContext, Next: KoaNext, Middleware: KoaMiddleware } from "koa"; // need koa@v2.0.0+ (eg: koa@^2.15.3)
import type { KoaContext, KoaNext } from "mihawk/com-types";

// init a koa-router instance
const router = new Router();

/*
// @ts-expect-error mihawk 运行时会提供 router 的完整类型能力，这里只做本地编译兜底。
router.get('/api/demo', async (ctx: KoaContext) => {
  ctx.status = 200;
  ctx.type = 'application/json';
  ctx.body = {
    headers: {
      lang: ctx.get('lang') || ctx.get('accept-language') || 'zh-CN',
      theme: ctx.get('theme') || 'system',
    },
    ok: true,
    requestedAt: new Date().toISOString(),
  };
});
*/

// define your each custom routes
type ReviewStatus = "queued" | "running" | "completed" | "failed";
type ReviewStage =
  "searching" | "screening" | "reading" | "synthesizing" | "generating_report" | "completed";

interface ReviewRecord {
  reviewId: string;
  question: string;
  createdAtMs: number;
  failJob: boolean;
  flaky: boolean;
  flakyFailureServed: boolean;
}

interface Progress {
  current?: number;
  total?: number;
  message: string;
}

interface ReviewResponse {
  review_id: string;
  question: string;
  status: ReviewStatus;
  stage?: ReviewStage;
  progress?: Progress;
  partial_text?: string;
  result_available?: boolean;
  error?: {
    code: string;
    message: string;
  };
  created_at: string;
  updated_at: string;
}
const reviews = new Map<string, ReviewRecord>();

const demo_report_filepath = path.join(__dirname, "./tmp/report.txt");
const REPORT_TEXT = fs.readFileSync(demo_report_filepath, { encoding: "utf-8" });

const timeline = [
  { untilMs: 2_000, status: "queued" as const, message: "Waiting to start" },
  {
    untilMs: 5_000,
    status: "running" as const,
    stage: "searching" as const,
    current: 10,
    total: 100,
    message: "Searching for relevant papers",
    text: "",
  },
  {
    untilMs: 8_000,
    status: "running" as const,
    stage: "screening" as const,
    current: 30,
    total: 100,
    message: "Screening candidate papers",
    text: "Recent work in protein-ligand binding prediction ",
  },
  {
    untilMs: 11_000,
    status: "running" as const,
    stage: "reading" as const,
    current: 55,
    total: 100,
    message: "Reading selected papers",
    text: "Recent work in protein-ligand binding prediction increasingly combines structure-based modeling ",
  },
  {
    untilMs: 14_000,
    status: "running" as const,
    stage: "synthesizing" as const,
    current: 75,
    total: 100,
    message: "Synthesizing findings",
    text: "Recent work in protein-ligand binding prediction increasingly combines structure-based modeling, graph neural networks, ",
  },
  {
    untilMs: 17_000,
    status: "running" as const,
    stage: "generating_report" as const,
    current: 92,
    total: 100,
    message: "Generating the final report",
    text: "Recent work in protein-ligand binding prediction increasingly combines structure-based modeling, graph neural networks, and large pretrained models.",
  },
];

function buildReviewResponse(review: ReviewRecord): ReviewResponse {
  const now = Date.now();
  const elapsedMs = now - review.createdAtMs;
  const createdAt = new Date(review.createdAtMs).toISOString();
  const updatedAt = new Date(now).toISOString();

  if (review.failJob && elapsedMs >= 10_000) {
    return {
      review_id: review.reviewId,
      question: review.question,
      status: "failed",
      error: {
        code: "REVIEW_FAILED",
        message: "The literature review could not be completed.",
      },
      created_at: createdAt,
      updated_at: updatedAt,
    };
  }

  const phase = timeline.find((entry) => elapsedMs < entry.untilMs);

  if (!phase) {
    return {
      review_id: review.reviewId,
      question: review.question,
      status: "completed",
      stage: "completed",
      progress: {
        current: 100,
        total: 100,
        message: "Review complete",
      },
      partial_text:
        "Recent work in protein-ligand binding prediction increasingly combines structure-based modeling, graph neural networks, and large pretrained models.",
      result_available: true,
      created_at: createdAt,
      updated_at: updatedAt,
    };
  }

  if (phase.status === "queued") {
    return {
      review_id: review.reviewId,
      question: review.question,
      status: "queued",
      progress: { message: phase.message },
      created_at: createdAt,
      updated_at: updatedAt,
    };
  }

  return {
    review_id: review.reviewId,
    question: review.question,
    status: "running",
    stage: phase.stage,
    progress: {
      current: phase.current,
      total: phase.total,
      message: phase.message,
    },
    partial_text: phase.text,
    result_available: false,
    created_at: createdAt,
    updated_at: updatedAt,
  };
}
// @ts-expect-error mihawk 运行时会提供 router 的完整类型能力，这里只做本地编译兜底。
router.post("/api/reviews", (ctx: KoaContext) => {
  const jsonBody = ctx.state.jsonBody;
  const question = typeof jsonBody?.question === "string" ? jsonBody.question.trim() : "";

  if (!question) {
    ctx.status = 400;
    ctx.body = {
      error: {
        code: "INVALID_REQUEST",
        message: "question must be a non-empty string",
      },
    };
    return;
  }

  if (question.includes("[fail-submit]")) {
    ctx.status = 500;
    ctx.body = {
      error: {
        code: "CREATE_REVIEW_FAILED",
        message: "The review could not be created.",
      },
    };
    return;
  }

  const reviewId = `lr_${randomUUID().replaceAll("-", "").slice(0, 10)}`;

  reviews.set(reviewId, {
    reviewId,
    question,
    createdAtMs: Date.now(),
    failJob: question.includes("[fail-job]"),
    flaky: question.includes("[flaky]"),
    flakyFailureServed: false,
  });

  ctx.status = 202;
  ctx.body = {
    review_id: reviewId,
    status: "queued",
  };
});

// 新增：历史综述列表（侧栏展示 + 数量）。仅新增端点，不改动任何现有逻辑。
// @ts-expect-error mihawk 运行时会提供 router 的完整类型能力，这里只做本地编译兜底。
router.get("/api/reviews", (ctx: KoaContext) => {
  const limit = Number(ctx.query.limit ?? 50);
  const offset = Number(ctx.query.offset ?? 0);
  const all = [...reviews.values()].sort((a, b) => b.createdAtMs - a.createdAtMs);
  const items = all.slice(offset, offset + limit).map((r) => {
    const s = buildReviewResponse(r);
    return {
      review_id: s.review_id,
      question: s.question,
      status: s.status,
      stage: s.stage,
      result_available: s.result_available ?? false,
      created_at: s.created_at,
      updated_at: s.updated_at,
    };
  });
  ctx.body = { reviews: items, total: all.length };
});

// @ts-expect-error mihawk 运行时会提供 router 的完整类型能力，这里只做本地编译兜底。
router.get("/api/reviews/:reviewId", (ctx: KoaContext) => {
  const reviewId = ctx.params.reviewId!;
  const review = reviews.get(reviewId);

  if (!review) {
    ctx.status = 404;
    ctx.body = {
      error: {
        code: "REVIEW_NOT_FOUND",
        message: "The requested review does not exist.",
      },
    };
    return;
  }

  if (review.flaky && !review.flakyFailureServed) {
    review.flakyFailureServed = true;
    ctx.status = 503;
    ctx.body = {
      error: {
        code: "TEMPORARILY_UNAVAILABLE",
        message: "Review status is temporarily unavailable. Please retry.",
      },
    };
    return;
  }

  ctx.body = buildReviewResponse(review);
});

// @ts-expect-error mihawk 运行时会提供 router 的完整类型能力，这里只做本地编译兜底。
router.get("/api/reviews/:reviewId/download", (ctx: KoaContext) => {
  const reviewId = ctx.params.reviewId!;
  const review = reviews.get(reviewId);

  if (!review) {
    ctx.status = 404;
    ctx.body = {
      error: {
        code: "REVIEW_NOT_FOUND",
        message: "The requested review does not exist.",
      },
    };
    return;
  }

  const current = buildReviewResponse(review);
  if (current.status !== "completed") {
    ctx.status = 409;
    ctx.body = {
      error: {
        code: "RESULT_NOT_READY",
        message: "The final report is not yet available.",
      },
    };
    return;
  }

  const expiresAt = new Date(Date.now() + 5 * 60_000).toISOString();
  const baseUrl = `${ctx.protocol}://${ctx.get("host")}`;

  ctx.body = {
    download_url: `${baseUrl}/api/mock-files/${review.reviewId}/report.md`,
    expires_at: expiresAt,
  };
});

// @ts-expect-error mihawk 运行时会提供 router 的完整类型能力，这里只做本地编译兜底。
router.get("/api/mock-files/:reviewId/report.md", (ctx: KoaContext) => {
  const reviewId = ctx.params.reviewId!;
  const review = reviews.get(reviewId);

  if (!review) {
    ctx.status = 404;
    ctx.type = "html";
    ctx.body = "Review not found";
    return;
  }

  const current = buildReviewResponse(review);
  if (current.status !== "completed") {
    ctx.status = 409;
    ctx.type = "html";
    ctx.body = "Report is not ready";
    return;
  }

  ctx.set("Content-Type", "text/markdown; charset=utf-8");
  ctx.set("Content-Disposition", `attachment; filename="${review.reviewId}-report.md"`);
  ctx.body = REPORT_TEXT;
});

// ...

/**
 * exports a default middleware
 * - use koa-compose to compose all routes middleware
 */
export default Compose([
  async function log(ctx: KoaContext, next: KoaNext) {
    const { ip, url, method, disableLogPrint } = ctx;
    if (!disableLogPrint) {
      console.log(`\n${method.toUpperCase()} ${url},`, `Visited by addr(${ip})`);
    }
    await next();
  },
  router.routes(), //
  router.allowedMethods(),
]);
