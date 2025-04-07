"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  image: z
    .string()
    .optional()
    .refine((val) => !val || /^https?:\/\/.+/.test(val), {
      message: "Must be a valid URL or left empty",
    }),
});

export default function SignUp() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      image: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    setErrorMessage("");

    let uploadedAvatarUrl: string | null = null;

    if (avatarFile) {
      const uploadForm = new FormData();
      uploadForm.append("file", avatarFile);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadForm,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Avatar upload failed");
      uploadedAvatarUrl = data.url;
    }

    // Assign a random avatar if the image is not provided
    const randomSeed = `${values.name}-${Math.random()
      .toString(36)
      .substring(2, 8)}`;
    const image =
      uploadedAvatarUrl ||
      `https://api.dicebear.com/7.x/lorelei/png?seed=${encodeURIComponent(
        randomSeed
      )}`;

    try {
      const { data, error } = await authClient.signUp.email(
        {
          ...values,
          image,
          callbackURL: "/dashboard",
        },
        {
          onRequest: () => {},
          onSuccess: () => {
            window.location.href = "/dashboard";
          },
          onError: (ctx) => {
            setErrorMessage(ctx.error.message);
          },
        }
      );

      if (error) throw new Error(error.message);
    } catch (error) {
      setLoading(false);
      setErrorMessage("There was an error during sign-up. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-center mb-4">Sign Up</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel htmlFor="avatar">Upload Avatar (optional)</FormLabel>
              <Input
                id="avatar"
                name="avatar"
                type="file"
                accept="image/*"
                onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
              />
            </div>

            {errorMessage && (
              <p className="text-red-500 text-sm">{errorMessage}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
