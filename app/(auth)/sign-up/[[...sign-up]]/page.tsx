import React from "react";
import { Loader2, Vault } from "lucide-react";
import { ClerkLoaded, ClerkLoading, SignUp } from "@clerk/nextjs";

const SignUpPage = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Section - Sign In */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-4">
          <h1 className="text-2xl md:text-3xl font-bold text-center">
            Welcome Back!
          </h1>
          <p className="text-gray-600 text-center text-sm md:text-base">
            Log in or Create account to get back to your dashboard!
          </p>

          <ClerkLoading>
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          </ClerkLoading>

          <ClerkLoaded>
            <SignUp />
          </ClerkLoaded>
        </div>
      </div>

      {/* Right Section - Branding */}
      <div className="w-full lg:w-1/2 bg-blue-600  flex flex-col items-center justify-center p-6 lg:p-12 order-first lg:order-last">
        <div className="text-center space-y-4">
          <Vault className="h-12 w-12 md:h-16 md:w-16 mx-auto text-slate-100" />
          <h2 className="text-2xl md:text-3xl font-bold">CodeVault</h2>
          <p className="text-slate-300 text-sm md:text-base max-w-md">
            Secure your code snippets and development resources in one place
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
