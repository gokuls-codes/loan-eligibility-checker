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

const FormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
  name: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

const RegisterForm = () => {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      name: "",
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
      const resp = await AxiosInstance.post(ENDPOINTS.register, data);
      setMessage("Registration successful. Please login.");
      setIsError(false);
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
          render={({ field, fieldState }) => (
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
          name="name"
          render={({ field, fieldState }) => (
            <FormItem className=" h-20">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
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

        <Button className="w-full">Register</Button>
      </form>
    </Form>
  );
};

export default RegisterForm;
