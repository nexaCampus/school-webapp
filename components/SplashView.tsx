// Shared splash visuals: the boot overlay and the / splash route render
// the exact same markup so a reload looks identical to a fresh launch.
export default function SplashView({
  pct,
  label,
  onClick,
}: {
  pct: number;
  label: string;
  onClick?: () => void;
}) {
  return (
    <div
      className="app-column relative min-h-screen bg-surface flex flex-col items-center w-full px-margin py-space-lg cursor-pointer"
      onClick={onClick}
    >
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-[5px]">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="w-1.5 h-1.5 rounded-full bg-outline/30" />
          <span className="w-1.5 h-1.5 rounded-full bg-outline/30" />
        </div>
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px] text-tertiary">verified_user</span>
          <span className="font-label-sm text-label-sm font-bold text-on-surface-variant tracking-widest">
            SSL ENCRYPTED
          </span>
        </div>
      </div>

      <div className="relative mt-space-xl mb-space-md">
        <div className="absolute inset-0 -m-3 rounded-full bg-gradient-to-br from-primary/30 to-secondary-container/25 blur-xl" />
        <div className="relative w-[120px] h-[120px] rounded-full bg-surface-container-lowest shadow-[0_18px_36px_rgba(28,42,200,0.18)] p-2">
          <div className="w-full h-full rounded-full bg-gradient-to-b from-primary to-[#1D2CC9] flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-secondary-fixed text-[36px]">
              account_balance
            </span>
            <div className="flex items-center gap-[3px] mt-0.5">
              <span className="material-symbols-outlined text-secondary-fixed text-[11px]">star</span>
              <span className="material-symbols-outlined text-white text-[13px]">school</span>
              <span className="material-symbols-outlined text-secondary-fixed text-[11px]">star</span>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-secondary-container shadow-lg flex items-center justify-center">
          <span className="material-symbols-outlined text-on-secondary-container text-[18px]">
            workspace_premium
          </span>
        </div>
      </div>

      <div className="flex items-center gap-space-xs bg-surface-container-high rounded-full px-3 py-[5px] shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
        <span className="font-label-sm text-label-sm font-bold text-on-primary-fixed-variant tracking-widest">
          OFFICIAL ACADEMIC PORTAL
        </span>
      </div>

      <h1 className="font-display-lg-mobile text-display-lg-mobile text-on-surface text-center mt-space-md">
        Lions Calcutta
      </h1>
      <p className="text-[20px] leading-7 font-bold text-primary -mt-0.5">Gr Vidya Mandir</p>
      <p className="font-body-sm text-body-sm text-on-surface-variant text-center leading-[18px] max-w-[280px] mt-space-sm">
        Empowering holistic excellence through structured learning and digital connectivity.
      </p>

      <div className="w-full bg-surface-container-lowest/90 rounded-[20px] shadow-[0_10px_24px_rgba(28,42,200,0.12)] p-4 mt-space-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="w-[7px] h-[7px] rounded-full bg-primary animate-pulse" />
            <span className="font-label-md text-label-md font-semibold text-on-surface">{label}</span>
          </div>
          <span className="font-title-sm text-title-sm font-bold text-primary">{pct}%</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-surface-container mt-space-sm overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary via-primary-container to-secondary-container transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex items-center justify-center gap-1 mt-space-sm">
          <span className="material-symbols-outlined text-outline text-[11px]">lock</span>
          <span className="font-body-sm text-body-sm text-outline">
            Verifying cryptographic session credentials
          </span>
        </div>
      </div>

      <div className="mt-auto pt-space-xl flex flex-col items-center gap-space-xs w-full">
        <div className="flex items-center gap-space-xs bg-surface-container-low rounded-full px-3.5 py-1.5 shadow-sm">
          <span className="material-symbols-outlined text-secondary text-[13px]">auto_awesome</span>
          <span className="font-label-sm text-label-sm font-semibold text-on-surface-variant">
            Crafted with care by Vastavik Learning
          </span>
        </div>
        <div className="flex items-center gap-space-xs font-body-sm text-body-sm text-outline">
          <span>v2.5.3</span>
          <span>•</span>
          <span className="material-symbols-outlined text-tertiary text-[11px]">check_circle</span>
          <span>Enterprise Gateway</span>
        </div>
      </div>
    </div>
  );
}
