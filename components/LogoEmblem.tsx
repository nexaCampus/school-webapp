export default function LogoEmblem({ className = 'h-9 w-9' }: { className?: string }) {
  return (
    <div
      className={`relative rounded-xl bg-gradient-to-tr from-primary to-[#2a38e8] text-white flex items-center justify-center shadow-md flex-shrink-0 select-none ${className}`}
      aria-label="EduPortal Emblem"
    >
      <svg
        className="w-5 h-5 text-white"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Academic graduation cap / portal shield */}
        <path d="M12 3L1 9L12 15L21 10.09V17H23V9L12 3Z" />
        <path
          d="M5 13.18V17.18C5 19.84 8.13 22 12 22C15.87 22 19 19.84 19 17.18V13.18L12 17L5 13.18Z"
          fillOpacity="0.85"
        />
      </svg>
      <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-container opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary-container ring-2 ring-white"></span>
      </span>
    </div>
  );
}
