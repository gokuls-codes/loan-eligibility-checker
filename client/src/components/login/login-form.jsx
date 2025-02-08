"use client";

import React, { useState } from "react";
import { set, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { AxiosInstance } from "@/app/utils/axios-instance";
import { ENDPOINTS } from "@/constants";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

const LoginForm = () => {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (data) => {
    setIsError(false);
    setMessage("");
    try {
      const resp = await AxiosInstance.post(ENDPOINTS.login, data);
      router.push("/dashboard");
    } catch (err) {
      setIsError(true);
      setMessage(err.response.data.error || "Something went wrong.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className=" space-y-2">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className=" h-20">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Email" {...field} />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className=" h-20">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Password" {...field} />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <div className=" h-6">
          {message && (
            <p
              className={cn(
                "text-sm text-center",
                isError ? "text-destructive" : "text-green-400"
              )}
            >
              {message}
            </p>
          )}
        </div>

        <Button className="w-full">Login</Button>
      </form>
    </Form>
  );
};

export default LoginForm;
