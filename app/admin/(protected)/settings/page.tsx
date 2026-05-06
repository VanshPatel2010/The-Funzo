import { StoreSettingsForm } from "@/components/admin/StoreSettingsForm";
import { getAdminStoreSettings } from "@/lib/store-settings";

export default async function AdminSettingsPage() {
  const settings = await getAdminStoreSettings();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
        <p className="text-[#999999]">
          Configure the store details shown to customers across the website.
        </p>
      </div>
      <StoreSettingsForm settings={settings} />
    </div>
  );
}
