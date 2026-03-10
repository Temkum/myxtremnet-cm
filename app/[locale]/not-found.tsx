import Link from 'next/link';
import { NotFoundActions } from '@/components/not-found-actions';

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-background flex items-center justify-center overflow-hidden px-4">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Glowing orb behind the 404 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-lg w-full animate-in fade-in slide-in-from-bottom-6 duration-700">
        {/* Signal icon — on-brand for a telecom */}
        <div className="flex items-center justify-center gap-1.5 mb-8">
          {[2, 4, 6, 8, 6].map((h, i) => (
            <div
              key={i}
              className={`w-2 rounded-full transition-all ${
                i === 2 ? 'bg-destructive/60' : 'bg-primary/20'
              }`}
              style={{ height: `${h * 4}px`, animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>

        {/* 404 */}
        <h1 className="text-[120px] leading-none font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/20 select-none tabular-nums">
          404
        </h1>

        {/* Divider line */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            Signal Lost
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <p className="text-muted-foreground text-base mb-2 font-medium">
          This page seems to be out of coverage.
        </p>
        <p className="text-muted-foreground/60 text-sm mb-10">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex items-center justify-center">
          <NotFoundActions />
        </div>

        {/* Footer hint */}
        <p className="mt-8 text-sm text-muted-foreground/40">
          Lost?{' '}
          <Link
            href="/"
            className="underline underline-offset-2 hover:text-muted-foreground transition-colors"
          >
            Return to home
          </Link>
        </p>
      </div>
    </div>
  );
}
