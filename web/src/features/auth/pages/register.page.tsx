import { RegisterFormShadcn } from "../components/register-form-shadcn";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div>
        <h1 className="text-2xl font-bold mb-4">Register</h1>
        <RegisterFormShadcn />
      </div>
    </div>
  );
}
