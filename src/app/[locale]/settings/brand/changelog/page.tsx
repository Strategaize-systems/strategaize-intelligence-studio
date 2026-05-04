import { setRequestLocale } from "next-intl/server";
import { listBrandProfileChangelogAction } from "@/server/brand/actions";
import { Layout1Dashboard } from "@/components/layouts";
import { SettingsTabs } from "@/components/brand/SettingsTabs";
import { ChangelogList } from "@/components/brand/ChangelogList";

export default async function ChangelogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const result = await listBrandProfileChangelogAction(50);
  const entries = result.success ? result.entries : [];
  const error = !result.success ? result.error : null;

  return (
    <Layout1Dashboard
      title="Brand Profile — Changelog"
      subtitle="Versions-Audit pro Sektion (neuestes oben)."
    >
      <SettingsTabs />
      {error && (
        <div
          role="alert"
          className="rounded-xl border-2 border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
        >
          Changelog konnte nicht geladen werden: {error}
        </div>
      )}
      <ChangelogList entries={entries} />
    </Layout1Dashboard>
  );
}
