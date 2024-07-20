"use client"; // Add this at the top of the file

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Import useRouter

export default function LoginPage() {
  const router = useRouter(); // Initialize useRouter

  const handleRegisterClick = () => {
    router.push('/register'); // Navigate to the register page
  };

  const handleLoginClick = () => {
    router.push('/login');
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-300">
      <div className="flex w-[800px] h-[550px] bg-white rounded-lg shadow-lg overflow-hidden login-box">
        <div className="w-1/2 p-8">
          <h1 className="text-4xl font-bold mb-6 text-violet-900">Welcome to ArtSelling!</h1>
          <p className="mb-4 text-violet-800">Do you want to sell your amazing work? ArtSelling is the perfect place for you!</p>
          <form className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Username or Email</label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="••••••••"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Forgot your password?</a>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLoginClick}
              className="w-full py-2 px-4 bg-indigo-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Log in
            </button>
            <p className="mt-4 text-sm text-gray-600">
              Don't have an account? 
            </p>
            <button
              type="button"
              onClick={handleRegisterClick} // Add onClick handler
              className="w-full py-2 px-4 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-4"
            >
              Register Here
            </button>
          </form>
        </div>
        <div className="w-1/2 relative">
          <Image
            src="/image.png"
            alt="Background"
            layout="fill"
            objectFit="cover"
          />
        </div>
      </div>
    </main>
  );
}
