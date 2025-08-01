"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { registerSchema, RegisterSchema } from "../schemas/register.schema";

export function RegisterForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(formData: RegisterSchema) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      toast.success("User registered successfully");
      reset();
      router.push("/auth/login");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Name</label>
        <input {...register("name")} />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>
      <div>
        <label>Email</label>
        <input {...register("email")} />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>
      <div>
        <label>Password</label>
        <input {...register("password")} />
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}
      </div>
      <div>
        <label>Profile Picture</label>
        <input {...register("profilePic")} />
        {errors.profilePic && (
          <p className="text-red-500">{errors.profilePic.message}</p>
        )}
      </div>
      <div>
        <label>Referral Code</label>
        <input {...register("referralCode")} />
        {errors.referralCode && (
          <p className="text-red-500">{errors.referralCode.message}</p>
        )}
      </div>

      <button>{isSubmitting ? "Registering..." : "Register"}</button>
    </form>
  );
}
