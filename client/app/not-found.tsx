'use client';

import React from 'react';
import Link from 'next/link';
import {
  Leaf,
  AlertCircle,
  Home,
  Layout,
  PlaneLanding,
  TreeDeciduous,
} from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100 text-center px-6 overflow-hidden">
      {/* Background Animated Leaves */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 animate-leaf-drift opacity-20">
          <Leaf size={200} className="text-green-300" />
        </div>
        <div className="absolute bottom-10 right-20 animate-leaf-drift-reverse opacity-20">
          <Leaf size={180} className="text-teal-300" />
        </div>
        <div className="absolute bottom-0 left-0 animate-leaf-drift opacity-10">
          <TreeDeciduous size={250} className="text-emerald-200" />
        </div>
      </div>

      {/* Floating Alert Icons */}
      <div className="z-10 mb-8 flex gap-6 items-center animate-float-slow">
        <Leaf size={40} className="text-green-500 animate-bounce-slow" />
        <AlertCircle size={60} className="text-red-500 animate-pulse" />
        <PlaneLanding size={50} className="text-blue-600 animate-spin-slow" />
      </div>

      {/* 404 Title */}
      <h1 className="text-7xl font-black text-emerald-900 z-10 relative">
        404
        <span className="text-base absolute top-0 -right-14 bg-red-100 text-red-600 px-4 py-1 rounded-full">
          Lost in Nature
        </span>
      </h1>

      {/* Subtitle */}
      <p className="text-lg md:text-xl text-gray-700 max-w-xl mt-4 mb-8 z-10">
        You’ve wandered into an uncharted grove. This page doesn’t exist or has gone dormant like a winter leaf.
      </p>

      {/* Frosted Glass Info Box */}
      <div className="backdrop-blur-xl bg-white/40 border border-emerald-200 p-8 rounded-3xl shadow-lg z-10 max-w-md w-full mb-10 transition-all hover:scale-[1.02]">
        <div className="flex items-center mb-4 gap-3">
          <PlaneLanding size={28} className="text-blue-600" />
          <h2 className="text-xl font-semibold text-emerald-800">How to Get Back</h2>
        </div>
        <p className="text-gray-800 text-base">
          You can return to the homepage or view your plant health dashboard to resume your digital journey.
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-6 z-10">
        <Link
          href="/"
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition-transform hover:scale-105"
        >
          <Home size={20} />
          Home
        </Link>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition-transform hover:scale-105"
        >
          <Layout size={20} />
          Dashboard
        </Link>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes leafDrift {
          0% { transform: translate(0, 0) rotate(-30deg); }
          50% { transform: translate(30px, 40px) rotate(-20deg); }
          100% { transform: translate(0, 0) rotate(-30deg); }
        }

        @keyframes leafDriftReverse {
          0% { transform: translate(0, 0) rotate(30deg); }
          50% { transform: translate(-30px, -40px) rotate(20deg); }
          100% { transform: translate(0, 0) rotate(30deg); }
        }

        @keyframes floatSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        @keyframes spinSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .animate-leaf-drift {
          animation: leafDrift 20s ease-in-out infinite;
        }

        .animate-leaf-drift-reverse {
          animation: leafDriftReverse 20s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: floatSlow 8s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounceSlow 3s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spinSlow 18s linear infinite;
        }
      `}</style>
    </div>
  );
}
