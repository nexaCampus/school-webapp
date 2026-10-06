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
      className="relative min-h-screen bg-surface flex items-center justify-center p-4 sm:p-6 md:p-12 cursor-pointer w-full overflow-hidden"
      onClick={onClick}
    >
      {/* Ambient Atmospheric Backdrop Glows on Desktop */}
      <div className="hidden md:block absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="hidden md:block absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none" />

      {/* Main Responsive Card Container */}
      <div className="w-full max-w-md md:max-w-2xl mx-auto bg-surface-container-lowest/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 md:p-12 shadow-[0_20px_60px_-10px_rgba(28,42,200,0.14)] border border-outline/10 flex flex-col items-center text-center relative z-10 transition-all">
        {/* Top Header Row */}
        <div className="w-full flex items-center justify-between pb-2 md:pb-4 border-b border-outline/5">
          <div className="flex items-center gap-[5px]">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="w-2 h-2 rounded-full bg-outline/30" />
            <span className="w-2 h-2 rounded-full bg-outline/30" />
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-tertiary">
            <span className="material-symbols-outlined text-[15px]">verified_user</span>
            <span className="font-label-sm text-[11px] font-bold tracking-widest text-on-surface-variant uppercase">
              SSL 256-Bit Encrypted
            </span>
          </div>
        </div>

        {/* Central Emblem & Badge */}
        <div className="relative mt-6 md:mt-8 mb-4">
          <div className="absolute inset-0 -m-3 rounded-full bg-gradient-to-br from-primary/30 to-secondary-container/25 blur-xl" />
          <div className="relative w-[110px] h-[110px] md:w-[130px] md:h-[130px] rounded-full bg-surface-container-lowest shadow-[0_18px_36px_rgba(28,42,200,0.18)] p-2">
            <div className="w-full h-full rounded-full bg-gradient-to-b from-primary to-[#1D2CC9] flex flex-col items-center justify-center">
              <span className="material-symbols-outlined text-secondary-fixed text-[36px] md:text-[42px]">
                account_balance
              </span>
              <div className="flex items-center gap-[3px] mt-0.5">
                <span className="material-symbols-outlined text-secondary-fixed text-[11px]">star</span>
                <span className="material-symbols-outlined text-white text-[13px]">school</span>
                <span className="material-symbols-outlined text-secondary-fixed text-[11px]">star</span>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 w-9 h-9 md:w-10 md:h-10 rounded-full bg-secondary-container shadow-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-on-secondary-container text-[18px] md:text-[20px]">
              workspace_premium
            </span>
          </div>
        </div>

        {/* Portal Badges */}
        <div className="flex items-center gap-space-xs bg-surface-container-high rounded-full px-3.5 py-1 shadow-sm mt-2">
          <span className="w-2 h-2 rounded-full bg-tertiary" />
          <span className="font-label-sm text-[11px] font-bold text-on-primary-fixed-variant tracking-widest uppercase">
            Official Academic Portal
          </span>
        </div>

        {/* School Name */}
        <h1 className="font-headline-lg md:text-[34px] font-extrabold text-on-surface text-center mt-3 tracking-tight">
          Lions Calcutta
        </h1>
        <p className="text-[20px] md:text-[24px] leading-7 font-bold text-primary mt-0.5">
          Gr Vidya Mandir
        </p>
        <p className="font-body-sm text-[13px] md:text-[14px] text-on-surface-variant text-center leading-relaxed max-w-md mt-2">
          Empowering holistic excellence through structured learning and digital connectivity.
        </p>

        {/* Progress Container */}
        <div className="w-full bg-surface-container-low/70 rounded-2xl shadow-sm p-4 md:p-5 mt-6 border border-outline/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-label-md text-[13px] font-semibold text-on-surface">{label}</span>
            </div>
            <span className="font-title-sm text-[15px] font-bold text-primary">{pct}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-surface-container mt-3 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary via-primary-container to-secondary-container transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex items-center justify-center gap-1.5 mt-2.5">
            <span className="material-symbols-outlined text-outline text-[13px]">lock</span>
            <span className="font-body-sm text-[12px] text-outline">
              Verifying cryptographic session credentials
            </span>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 md:mt-8 flex flex-col items-center gap-2 w-full pt-4 border-t border-outline/5">
          <div className="flex items-center gap-2 bg-surface-container-low rounded-full px-4 py-1.5 shadow-sm">
            <span className="material-symbols-outlined text-secondary text-[15px]">auto_awesome</span>
            <span className="font-label-sm text-[12px] font-semibold text-on-surface-variant">
              Crafted with care by Vastavik Learning
            </span>
          </div>
          <div className="flex items-center gap-2 font-body-sm text-[12px] text-outline">
            <span>v2.5.3</span>
            <span>•</span>
            <span className="material-symbols-outlined text-tertiary text-[14px]">check_circle</span>
            <span>Enterprise Gateway</span>
          </div>
        </div>
      </div>
    </div>
  );
}
