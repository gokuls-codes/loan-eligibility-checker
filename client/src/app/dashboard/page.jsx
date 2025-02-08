"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { AxiosInstance } from "../utils/axios-instance";
import { ENDPOINTS } from "@/constants";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRightCircle } from "lucide-react";

const FormSchema = z.object({
  pan: z.string().length(10, {
    message: "Please enter a valid PAN",
  }),
});

const DashboardPage = () => {
  const [userProfile, setUserProfile] = useState({});
  const router = useRouter();
  const [eligibileValue, setEligibleValue] = useState(0);

  const eligibilityRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pan: "",
    },
  });

  const getUserProfile = async () => {
    try {
      const resp = await AxiosInstance.get(ENDPOINTS.profile);
      setUserProfile(resp.data);
    } catch (err) {
      console.log(err);
      router.push("/login");
    }
  };

  const handlePanSubmit = async (data) => {
    try {
      const resp = await AxiosInstance.post(ENDPOINTS.eligibility, data);
      console.log(resp.data);
      setEligibleValue(resp.data?.eligibleAmount);
      scrollToEligibility();
    } catch (err) {
      console.log(err);
    }
  };

  const scrollToEligibility = () => {
    eligibilityRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  return (
    <main className=" min-h-screen w-full">
      <section className=" h-screen grid place-items-center">
        <div className=" space-y-2 w-full max-w-sm">
          <h1 className=" text-3xl font-semibold text-center">
            Welcome, {userProfile?.name}
          </h1>
          <p className=" text-center text-xl font-light">
            Check your loan eligibility in seconds!
          </p>
          <div className=" w-full">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handlePanSubmit)}
                className=" my-6 flex items-start justify-center gap-4 w-full"
              >
                <FormField
                  control={form.control}
                  name="pan"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          placeholder="Enter PAN"
                          {...field}
                          className="h-10"
                        />
                      </FormControl>
                      <div className=" h-4">
                        <FormMessage className="text-xs" />
                      </div>
                    </FormItem>
                  )}
                />
                <Button className="h-10">
                  <span>Check</span>
                  <ArrowRightCircle />
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </section>
      <section
        className=" h-screen bg-blue-800 grid place-items-center"
        ref={eligibilityRef}
      >
        <div className=" space-y-2 w-full max-w-sm">
          <h1 className=" text-3xl font-semibold text-center">
            Congratulations, {userProfile.name}!
          </h1>
          <p className=" text-center text-xl font-light">
            Based on your holdings, you are eligible for a loan of upto*
          </p>
          <p className=" text-7xl text-center font-semibold">
            {eligibileValue.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            })}
          </p>
          <div className=" w-full grid place-items-center">
            <Button
              variant="outline"
              className=" bg-blue-800 mt-8 border-white hover:bg-blue-800/20"
              onClick={() => router.push("/history")}
            >
              View past checks
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DashboardPage;
