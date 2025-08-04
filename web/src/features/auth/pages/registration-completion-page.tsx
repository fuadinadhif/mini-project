import { RegistrationCompletionForm } from "../components/registration-completion-form";

export function RegistrationCompletionPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center">
      <h2 className="mb-4 text-2xl font-bold uppercase">
        Complete Registration
      </h2>
      <RegistrationCompletionForm />
    </div>
  );
}
