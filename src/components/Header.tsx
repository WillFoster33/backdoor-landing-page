export default function Header({ onVenueOwnerClick }: { onVenueOwnerClick?: () => void }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-6 flex items-center justify-between">
      <span className="text-white/90 text-lg font-medium tracking-tight">
        Backdoor
      </span>
      <button
        onClick={onVenueOwnerClick}
        className="text-white/80 hover:text-white text-sm font-medium transition-colors"
      >
        Venue owner?
      </button>
    </header>
  );
}
