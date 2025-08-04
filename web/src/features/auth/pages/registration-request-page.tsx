import { RegistrationRequestForm } from "../components/registration-request-form";

export function RegistrationRequestPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center">
      <h2 className="mb-4 text-2xl font-bold uppercase">Register</h2>
      <RegistrationRequestForm />
    </div>
  );
}
