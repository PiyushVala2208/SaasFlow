export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-background">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-125 w-125 bg-accent/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md p-6 relative z-10">{children}</div>
    </div>
  );
}
