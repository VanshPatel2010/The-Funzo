import { StoreSettingsForm } from "@/components/admin/StoreSettingsForm";
import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";
import { getAdminStoreSettings } from "@/lib/store-settings";

export default async function AdminSettingsPage() {
  const settings = await getAdminStoreSettings();

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-bold text-black mb-2">Settings</h1>
        <p className="text-[#999999]">
          Configure the store details shown to customers across the website.
        </p>
      </div>

      {/* Store Settings Section */}
      <div>
        <h2 className="text-2xl font-bold text-black mb-6">Store Settings</h2>
        <StoreSettingsForm settings={settings} />
      </div>

      {/* Password Change Section */}
      <div className="border-t border-gray-700 pt-12">
        <h2 className="text-2xl font-bold text-black mb-6">Security</h2>
        <div className="bg-gray-800 p-8 rounded-lg">
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}
