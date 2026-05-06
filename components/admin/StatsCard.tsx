// ─── Stats Card Component ──────────────────────────────────────────────────

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  description?: string;
}

export function StatsCard({ icon, label, value, description }: StatsCardProps) {
  return (
    <div className="bg-[#252525] rounded-2xl p-8 border border-[#333333] shadow-lg">
      {/* Icon */}
      <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-[#E84A2F]/10 mb-6">
        <div className="text-[#E84A2F] text-2xl">{icon}</div>
      </div>

      {/* Label */}
      <p className="text-sm font-semibold text-[#CCCCCC] uppercase tracking-wide mb-2">
        {label}
      </p>

      {/* Value */}
      <p className="text-4xl font-bold text-white mb-2">{value}</p>

      {/* Description */}
      {description && <p className="text-xs text-[#999999]">{description}</p>}
    </div>
  );
}
