import { defaultLanguage } from "@/i18n/constants";

export async function GET(request: Request) {
  const headers = request.headers;
  const lang = headers.get("lang") ?? defaultLanguage;
  const theme = headers.get("theme") ?? "system";

  return Response.json({
    headers: {
      lang,
      theme,
    },
    ok: true,
    requestedAt: new Date().toISOString(),
  });
}
