import { Loader2 } from "lucide-react";

export default function SettingsLoadingState() {
  return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="animate-spin text-accent" size={40} />
    </div>
  );
}
