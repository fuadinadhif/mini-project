import { RegisterForm } from "../components/register-form";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div>
        <h1 className="text-2xl font-bold mb-4">Register</h1>
        <RegisterForm />
      </div>
    </div>
  );
}
