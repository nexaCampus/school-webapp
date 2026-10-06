import Link from 'next/link';

function MethodCard({
  href,
  title,
  subtitle,
  badge,
  icon,
  iconWell,
  accent,
}: {
  href: string;
  title: string;
  subtitle: string;
  badge: string;
  icon: string;
  iconWell: string;
  accent: string;
}) {
  return (
    <Link
      href={href}
      className="w-full bg-surface-container-lowest/95 rounded-[22px] shadow-[0_8px_20px_rgba(28,42,200,0.10)] p-4 flex items-center gap-[14px] active:scale-[0.99] transition-transform"
    >
      <span
        className={`w-[46px] h-[46px] rounded-[14px] ${iconWell} flex items-center justify-center flex-shrink-0`}
      >
        <span className={`material-symbols-outlined ${accent} text-[24px]`}>{icon}</span>
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-[15px] font-bold text-on-surface">{title}</span>
        <span className="block font-body-sm text-body-sm text-on-surface-variant leading-[15px] mt-0.5">
          {subtitle}
        </span>
        <span
          className={`inline-block mt-1 text-[9px] font-bold ${accent} bg-surface-container-high rounded-full px-2 py-0.5`}
        >
          {badge}
        </span>
      </span>
      <span className="material-symbols-outlined text-outline text-[20px]">arrow_forward</span>
    </Link>
  );
}

export default function ChooserPage() {
  return (
    <div className="app-column relative min-h-screen bg-surface flex flex-col items-center w-full px-margin py-space-md">
      <div className="flex-1 min-h-[10vh]" aria-hidden="true" />
      <div className="w-[76px] h-[76px] rounded-full bg-surface-container-lowest shadow-[0_10px_24px_rgba(28,42,200,0.12)] p-[7px] mt-space-sm">
        <div className="w-full h-full rounded-full bg-gradient-to-b from-primary to-primary-container flex items-center justify-center">
          <span className="material-symbols-outlined text-white text-[30px]">verified</span>
        </div>
      </div>

      <h1 className="font-headline-lg text-headline-lg text-on-surface text-center mt-space-md">
        How would you like to sign in?
      </h1>
      <p className="font-body-sm text-body-sm text-on-surface-variant text-center leading-[18px] mt-space-xs">
        Pick the credential the school has on file for you.
      </p>

      <div className="w-full mt-space-lg">
        <MethodCard
          href="/admission"
          title="Admission Number"
          subtitle="Issued on your ID card and fee receipt"
          badge="Firebase"
          icon="badge"
          iconWell="bg-primary-fixed"
          accent="text-primary"
        />
      </div>
      <div className="w-full mt-space-md">
        <MethodCard
          href="/email"
          title="Email or Google"
          subtitle="Sign in with Google, or email and password"
          badge="Google + Email"
          icon="mail"
          iconWell="bg-[#D7F5E7]"
          accent="text-tertiary"
        />
      </div>

      <div className="w-full bg-surface-container-low/70 rounded-[14px] p-3 flex gap-[10px] mt-space-md">
        <span className="material-symbols-outlined text-primary text-[18px] flex-shrink-0">sms</span>
        <p className="font-body-sm text-body-sm text-on-surface-variant leading-[15px]">
          Admission numbers resolve against the live school roster once you&apos;re signed in.
        </p>
      </div>

      <div className="mt-auto pt-space-lg flex flex-col items-center gap-1 w-full">
        <span className="font-body-sm text-body-sm text-on-surface-variant">Need help logging in?</span>
        <span className="flex items-center gap-1.5 text-primary">
          <span className="material-symbols-outlined text-[16px]">support_agent</span>
          <span className="text-[12px] font-semibold">Contact School Admin Office</span>
        </span>
      </div>
    </div>
  );
}
