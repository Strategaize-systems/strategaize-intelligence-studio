import { setRequestLocale } from "next-intl/server";
import { getActiveBrandProfileAction } from "@/server/brand/actions";
import { Layout1Dashboard } from "@/components/layouts";
import { BrandProfileForm } from "@/components/brand/BrandProfileForm";
import { SettingsTabs } from "@/components/brand/SettingsTabs";
import { ToastProvider } from "@/components/brand/Toast";

export default async function BrandSettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const result = await getActiveBrandProfileAction();
  const initialData = result.success ? result.profile?.data ?? null : null;
  const initialVersion = result.success ? result.profile?.version ?? null : null;
  const loadError = !result.success ? result.error : null;

  return (
    <ToastProvider>
      <Layout1Dashboard
        title="Brand Profile"
        subtitle="Zwoelf-Sektionen-Singleton — verbindlicher Kontext fuer alle Marketing-Generierungen."
      >
        <SettingsTabs />
        {loadError && (
          <div
            role="alert"
            className="rounded-xl border-2 border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
          >
            Brand Profile konnte nicht geladen werden: {loadError}
          </div>
        )}
        {!initialData && !loadError && (
          <div className="rounded-xl border-2 border-slate-200 bg-white px-5 py-4 text-sm text-slate-700">
            <p className="font-bold mb-1">Noch kein Brand Profile angelegt.</p>
            <p>
              Trage die zwoelf Sektionen unten ein und speichere — danach
              versorgt das Profile alle Bedrock-Generierungen (FEAT-009 / FEAT-016).
            </p>
          </div>
        )}
        <BrandProfileForm
          initialData={initialData}
          initialVersion={initialVersion}
        />
      </Layout1Dashboard>
    </ToastProvider>
  );
}
