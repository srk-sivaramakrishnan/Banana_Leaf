'use client';

import { useState } from "react";
import { Leaf, Loader2, Home, Check, Eye, EyeOff } from "lucide-react";
import { useRouter } from 'next/router';
import { auth, googleProvider } from "../../services/firebaseConfig";
import { signInWithPopup } from "firebase/auth";

const baseURL = process.env.NEXT_PUBLIC_BASEURL;

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);

  // Handle changes in input fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
  
    const router = useRouter(); // Initialize the router for navigation
  
    try {
      const response = await fetch(`${baseURL}/pages/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
  
      // Read the raw response text
      const text = await response.text();
      console.log("Raw response text:", JSON.stringify(text));
  
      // Trim the text and attempt to parse JSON
      const trimmedText = text.trim();
      let data;
      try {
        data = JSON.parse(trimmedText);
      } catch (jsonError) {
        throw new Error("Failed to parse JSON. Raw response: " + trimmedText);
      }
  
      console.log("Response data:", data);
  
      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }
  
      // Store the token in sessionStorage
      sessionStorage.setItem('token', data.token);
  
      console.log("User created:", data.user);
      setSubmitted(true);
  
      // Redirect to dashboard
      router.push('/dashboard'); // Redirect to the dashboard page
  
      // Optionally clear or redirect the form here
      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    } catch (err: any) {
      console.error("Signup failed:", err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Next step for the multi-step form
  const nextStep = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStep(2);
  };

  // Back button event handler
  const prevStep = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setStep(1);
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      // Update form fields with data from Google account if available
      setFormData((prev) => ({
        ...prev,
        name: user.displayName || "",
        email: user.email || "",
      }));
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col">
      {/* Header */}
      <header className="w-full p-4 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Leaf className="text-green-600 mr-2" />
            <span className="font-bold text-lg text-green-800">BananaLeaf AI</span>
          </div>
          <a href="/" className="flex items-center text-green-600 hover:text-green-800 transition-colors">
            <Home size={18} />
            <span className="ml-2">Back to Home</span>
          </a>
        </div>
      </header>

      <div className="flex-grow flex flex-col md:flex-row mx-auto w-full max-w-7xl p-4">
        {/* Left Side - Informative Section */}
        <div className="md:w-1/2 p-6 flex flex-col justify-center">
          <div className="mb-8 max-w-lg">
            <div className="flex items-center mb-6">
              <div className="p-4 bg-green-600 rounded-full">
                <Leaf size={32} className="text-white" />
              </div>
              <h1 className="text-4xl font-bold ml-4 text-green-800">BananaLeaf AI</h1>
            </div>

            <h2 className="text-3xl font-semibold mb-6 text-gray-800">
              Revolutionizing Banana Farming with AI Technology
            </h2>

            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              BananaLeaf AI empowers farmers by detecting diseases on banana leaves early,
              ensuring healthier crops and increased yields.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="font-semibold text-green-700 mb-2">Early Detection</div>
                <p className="text-gray-600">Identify leaf diseases before they spread across your plantation</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="font-semibold text-green-700 mb-2">Increased Yield</div>
                <p className="text-gray-600">Boost your harvest by up to 40% with proactive disease management</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="font-semibold text-green-700 mb-2">Real-time Analysis</div>
                <p className="text-gray-600">Get instant diagnoses using your smartphone camera</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="font-semibold text-green-700 mb-2">Expert Advice</div>
                <p className="text-gray-600">Receive tailored treatment recommendations from agronomists</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="md:w-1/2 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
            <h2 className="text-3xl font-bold text-center text-green-800 mb-2">
              {step === 1 ? "Join BananaLeaf AI" : "Complete Your Profile"}
            </h2>
            <p className="text-center text-gray-500 mb-6">
              {step === 1
                ? "Create your account and transform your farming today"
                : "Just a few more details to get you started"}
            </p>

            {submitted ? (
              <div className="py-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                  <Check className="text-green-600" size={32} />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">Account Created!</h3>
                <p className="text-gray-600">Welcome to BananaLeaf AI. You can now log in to your account.</p>
              </div>
            ) : (
              <form onSubmit={step === 1 ? nextStep : handleSubmit} className="space-y-4">
                {step === 1 ? (
                  <>
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-black mb-1">
                        Full Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-black mb-1">
                        Email Address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email address"
                        className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-black mb-1">
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 234 567 890"
                        className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-black mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          required
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Create a secure password"
                          className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-10"
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Must be at least 8 characters with 1 number and 1 special character
                      </p>
                    </div>
                  </>
                )}

                {error && (
                  <div className="text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <div className="pt-2">
                  {step === 1 ? (
                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Continue
                    </button>
                  ) : (
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="w-1/3 py-2.5 px-4 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition duration-300"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-2/3 py-2.5 px-4 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center justify-center"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 size={18} className="animate-spin mr-2" />
                            Creating Account...
                          </>
                        ) : (
                          "Create Account"
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {step === 1 && (
                  <>
                    <div className="relative flex items-center justify-center my-4">
                      <div className="border-t border-gray-200 flex-grow"></div>
                      <div className="mx-4 text-sm text-gray-500">or continue with</div>
                      <div className="border-t border-gray-200 flex-grow"></div>
                    </div>

                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      className="w-full flex items-center justify-center gap-3 py-2.5 px-4 text-black bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                      </svg>
                      Sign up with Google
                    </button>
                  </>
                )}
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <a href="/signin" className="text-green-600 hover:text-green-800 font-medium">
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-4 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          © 2025 BananaLeaf AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
