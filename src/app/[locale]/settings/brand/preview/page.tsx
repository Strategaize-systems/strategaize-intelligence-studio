import { setRequestLocale } from "next-intl/server";
import { getActiveBrandProfileAction } from "@/server/brand/actions";
import { Layout1Dashboard } from "@/components/layouts";
import { SettingsTabs } from "@/components/brand/SettingsTabs";
import { PromptSnippetPreview } from "@/components/brand/PromptSnippetPreview";

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const result = await getActiveBrandProfileAction();
  const profile = result.success ? result.profile : null;
  const error = !result.success ? result.error : null;

  return (
    <Layout1Dashboard
      title="Brand Profile — Prompt-Vorschau"
      subtitle="So sieht der Bedrock-System-Prompt aus, der allen Marketing-Generierungen vorangeht."
    >
      <SettingsTabs />
      {error && (
        <div
          role="alert"
          className="rounded-xl border-2 border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
        >
          Brand Profile konnte nicht geladen werden: {error}
        </div>
      )}
      {!error && !profile && (
        <div className="rounded-xl border-2 border-slate-200 bg-white px-5 py-4 text-sm text-slate-700">
          Noch kein Brand Profile gespeichert. Lege zuerst ein Profile im Tab
          „Profil" an.
        </div>
      )}
      {profile && <PromptSnippetPreview profile={profile.data} />}
    </Layout1Dashboard>
  );
}
