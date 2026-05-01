import { Suspense } from "react";
import RegisterForm from "./RegisterForm";

function RegisterFallback() {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-neutral-500">
      <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      <p>Loading registration form...</p>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<RegisterFallback />}>
      <RegisterForm />
    </Suspense>
  );
}
