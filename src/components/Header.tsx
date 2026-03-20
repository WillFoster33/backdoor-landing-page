export default function Header({ onVenueOwnerClick }: { onVenueOwnerClick?: () => void }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <img src="https://v1lgjc6lddlnqffz.public.blob.vercel-storage.com/logo.jpg" alt="Backdoor" className="w-8 h-8 rounded-lg object-cover" />
        <span className="text-white/90 text-lg font-medium tracking-tight">
          Backdoor
        </span>
      </div>
      <button
        onClick={onVenueOwnerClick}
        className="text-white/80 hover:text-white text-sm font-medium cursor-pointer transition-all duration-200 hover:underline underline-offset-2"
      >
        Venue owner?
      </button>
    </header>
  );
}
