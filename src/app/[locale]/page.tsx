import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home");

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-page mx-auto px-8 py-16">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
          {t("heading")}
        </h1>
        <p className="text-sm text-slate-600 font-medium mb-8">{t("lead")}</p>

        <div className="bg-white rounded-xl border-2 border-slate-200 p-6 shadow-lg">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Foundation aktiv (SLC-101)
          </h2>
          <ul className="space-y-2 text-sm text-slate-700">
            <li>✓ Next.js 16 + React 19</li>
            <li>✓ Tailwind 3 + Style Guide V2 Tokens</li>
            <li>✓ Worker-Skeleton (asset_generation, pitch_generation, lead_research_run)</li>
            <li>✓ 4 Adapter-Skeletons (firecrawl, clay-csv, business-pipeline, linkedin-ads-csv)</li>
            <li>✓ Feature-Flag-System</li>
            <li>✓ MIG-002 (16 V1-Tabellen)</li>
          </ul>
          <div className="mt-6">
            <Link
              href="/_design-system"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-brand text-white font-bold shadow-lg hover:shadow-xl transition-all"
            >
              Design System Showcase →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
