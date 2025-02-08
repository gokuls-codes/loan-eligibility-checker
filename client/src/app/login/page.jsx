import LoginForm from "@/components/login/login-form";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const LoginPage = () => {
  return (
    <div className=" w-screen h-screen grid place-items-center ">
      <main className=" p-4 border rounded-sm max-w-xs w-full">
        <div className=" w-full flex items-center justify-center">
          <Image src={"/logo.png"} width={60} height={60} alt="logo" />
          <h1 className=" text-3xl font-thin text-center ">LEC</h1>
        </div>
        <h2 className=" text-center text-2xl mb-8 ">Login</h2>

        <LoginForm />

        <p className=" text-sm text-center mt-4">
          Don't have an account?{" "}
          <Link
            href={"/register"}
            className=" text-primary underline underline-offset-4"
          >
            Register here
          </Link>
        </p>
      </main>
    </div>
  );
};

export default LoginPage;
