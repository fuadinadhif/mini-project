"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterSchema } from "../schemas/register.schema";
import { toast } from "react-toastify";
import { useState } from "react";

export function RegisterFormReact() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: RegisterSchema) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.message || "Registration failed");
      }

      toast.success("User registered successfully");
      reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-md mx-auto"
    >
      <div>
        <label>Name</label>
        <input {...register("name")} className="input" />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <label>Email</label>
        <input {...register("email")} type="email" className="input" />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>

      <div>
        <label>Password</label>
        <input {...register("password")} type="password" className="input" />
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label>Profile Picture URL</label>
        <input {...register("profilePic")} className="input" />
        {errors.profilePic && (
          <p className="text-red-500">{errors.profilePic.message}</p>
        )}
      </div>

      <div>
        <label>Referral Code (optional)</label>
        <input {...register("referralCode")} className="input" />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
  );
}
