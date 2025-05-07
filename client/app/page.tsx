'use client';

import { useState } from "react";
import {
  Leaf,
  Microscope,
  Activity,
  Lightbulb,
  UploadCloud,
  User,
  ChevronDown,
  Info,
  Database,
  Map,
  ArrowRight
} from "lucide-react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  const handleUploadHover = () => {
    // In a real implementation, this would show a preview animation
    console.log("Upload button hovered");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white text-green-900 font-sans">
      {/* Navbar - Modern with Dropdown */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm px-6 md:px-12 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Leaf className="text-green-600" size={28} />
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-500">
              BananaLeaf AI
            </h1>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className={`transition hover:text-green-600 ${activeTab === "home" ? "text-green-600 font-medium" : ""}`} onClick={() => setActiveTab("home")}>Home</a>
            <a href="#about" className={`transition hover:text-green-600 ${activeTab === "about" ? "text-green-600 font-medium" : ""}`} onClick={() => setActiveTab("about")}>About</a>
            <a href="#features" className={`transition hover:text-green-600 ${activeTab === "features" ? "text-green-600 font-medium" : ""}`} onClick={() => setActiveTab("features")}>Features</a>
            <a href="#how" className={`transition hover:text-green-600 ${activeTab === "how" ? "text-green-600 font-medium" : ""}`} onClick={() => setActiveTab("how")}>How It Works</a>
            <a href="#team" className={`transition hover:text-green-600 ${activeTab === "team" ? "text-green-600 font-medium" : ""}`} onClick={() => setActiveTab("team")}>Team</a>
          </div>

          <div className="flex items-center gap-4">
            <a href="/signup" className="hidden md:inline-block px-4 py-2 rounded-lg bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition font-medium">
              Sign Up
            </a>
            <a href="/signin" className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-500 text-white hover:opacity-90 transition shadow-sm">
              Sign In
            </a>
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <ChevronDown className={`transition ${isMenuOpen ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-2 p-4 bg-white rounded-lg shadow-lg">
            <div className="flex flex-col space-y-3">
              <a href="#" className="hover:text-green-600">Home</a>
              <a href="#about" className="hover:text-green-600">About</a>
              <a href="#features" className="hover:text-green-600">Features</a>
              <a href="#how" className="hover:text-green-600">How It Works</a>
              <a href="#team" className="hover:text-green-600">Team</a>
              <a href="/dashboard" className="hover:text-green-600">Dashboard</a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section - with Interactive 3D-like Effect */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-400 opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-400 opacity-10 rounded-full blur-3xl"></div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="relative">
                Early
                <span className="absolute -bottom-2 left-0 w-full h-3 bg-green-200 opacity-40 rounded"></span>
              </span>{" "}
              Banana Leaf
              <br />
              Disease Detection
            </h2>
            <p className="text-lg md:text-xl text-green-700">
              Protect your banana crops with AI-powered early disease detection.
              Upload a photo and get instant analysis and treatment recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a
                href="/signin"
                className="inline-block px-6 py-3 rounded-xl text-white text-lg font-medium bg-gradient-to-r from-green-600 to-emerald-500 shadow-lg hover:shadow-xl hover:translate-y-px transition-all duration-200"
              >
                Try Now
              </a>
              <a
                href="#learn"
                className="inline-block px-6 py-3 rounded-xl text-green-700 text-lg font-medium bg-green-50 border border-green-200 hover:bg-green-100 transition"
              >
                Learn More
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-green-100 to-transparent rounded-3xl transform rotate-6 scale-95"></div>
            <div className="relative bg-white p-4 rounded-3xl shadow-xl overflow-hidden">
              <div className="aspect-w-4 aspect-h-3 bg-green-50 rounded-2xl overflow-hidden">
                <img
                  src="/banana-leaf.jpg"
                  alt="Banana plant with AI detection overlay"
                  className="object-cover rounded-2xl"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-900/80 to-transparent p-4">
                  <div className="flex items-center gap-2 text-white">
                    <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                    <span className="text-sm font-medium">Analyzing leaf pattern...</span>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-white font-bold">Results: Healthy</span>
                    <span className="text-xs bg-green-500/90 px-2 py-1 rounded-full text-white">98% confidence</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Modern with animations */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { number: "97%", label: "Accuracy Rate" },
            { number: "50K+", label: "Leaves Analyzed" },
            { number: "15+", label: "Disease Types" },
            { number: "24/7", label: "Support" }
          ].map((stat, index) => (
            <div key={index} className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
              <div className="text-3xl font-bold text-green-600">{stat.number}</div>
              <div className="text-green-700 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* About Section - Visual, modern */}
      <section id="about" className="py-20 px-6 bg-gradient-to-br from-green-50 to-white">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-block bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-medium">About the Project</div>
            <h2 className="text-3xl md:text-4xl font-bold">Making Banana Disease Detection Accessible</h2>
            <p className="text-lg text-green-700 max-w-3xl mx-auto">
              Our AI solution uses computer vision and deep learning to identify banana leaf diseases from simple photos. Early detection helps farmers take timely action and improve crop health.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm space-y-4 hover:shadow-md transition">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100 text-green-600">
                <Database size={24} />
              </div>
              <h3 className="text-xl font-semibold">Research-Backed</h3>
              <p className="text-green-700">Trained on thousands of expert-labeled banana leaf images for various disease types.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm space-y-4 hover:shadow-md transition">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100 text-green-600">
                <Map size={24} />
              </div>
              <h3 className="text-xl font-semibold">Region-Specific</h3>
              <p className="text-green-700">Specialized for tropical and subtropical banana-growing regions and varieties.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm space-y-4 hover:shadow-md transition">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100 text-green-600">
                <Info size={24} />
              </div>
              <h3 className="text-xl font-semibold">Actionable Insights</h3>
              <p className="text-green-700">Doesn't just detect disease—provides treatment recommendations and prevention tips.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Visually appealing cards */}
      <section id="features" className="py-20 px-6 bg-gradient-to-br from-green-50 to-white">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-block bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-medium">
              Key Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">Powerful Plant Protection</h2>
            <p className="text-lg text-green-700 max-w-3xl mx-auto">
              Our AI-powered tool gives you everything you need to monitor and protect your banana crops.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Leaf className="text-green-600" size={32} />,
                title: "Multi-Disease Detection",
                desc: "Identifies Black Sigatoka, Panama disease, Yellow Sigatoka, Bunchy Top, and more.",
                bgClass: "bg-gradient-to-br from-green-50 to-emerald-50"
              },
              {
                icon: <Microscope className="text-yellow-500" size={32} />,
                title: "Advanced CNN Model",
                desc: "Uses ResNet50 architecture fine-tuned on 50,000+ expert-labeled banana leaf images.",
                bgClass: "bg-gradient-to-br from-yellow-50 to-amber-50"
              },
              {
                icon: <Activity className="text-red-500" size={32} />,
                title: "Real-time Analysis",
                desc: "Get disease classification, severity assessment, and treatment recommendations in seconds.",
                bgClass: "bg-gradient-to-br from-blue-50 to-indigo-50"
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className={`rounded-2xl shadow-md p-8 space-y-4 transition hover:shadow-lg transform hover:-translate-y-1 ${feature.bgClass}`}
              >
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white shadow-sm">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-green-700">{feature.desc}</p>
                <a href="#" className="inline-flex items-center gap-1 text-green-600 font-medium hover:text-green-700">
                  Learn more <ArrowRight size={16} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section - Modern steps */}
      <section id="how" className="py-20 px-6">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-block bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-medium">
              Process
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
            <p className="text-lg text-green-700 max-w-3xl mx-auto">
              Our simple three-step process makes disease detection accessible to everyone.
            </p>
          </div>

          <div className="relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-green-200 -translate-y-1/2 rounded-full"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  icon: <UploadCloud className="text-white" size={28} />,
                  step: "1. Upload",
                  desc: "Take a clear photo of the banana leaf and upload it to our platform.",
                  iconBg: "bg-green-500"
                },
                {
                  icon: <Microscope className="text-white" size={28} />,
                  step: "2. Analyze",
                  desc: "Our AI analyzes the leaf pattern, color, and spots using computer vision.",
                  iconBg: "bg-green-600"
                },
                {
                  icon: <Lightbulb className="text-white" size={28} />,
                  step: "3. Act",
                  desc: "Receive disease identification, severity rating, and treatment advice.",
                  iconBg: "bg-green-700"
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="relative p-8 bg-white rounded-xl shadow-md space-y-4 z-10 hover:shadow-lg transition"
                >
                  <div className={`w-16 h-16 flex items-center justify-center rounded-full ${item.iconBg} shadow-lg mx-auto md:mx-0`}>
                    {item.icon}
                  </div>
                  <h4 className="font-semibold text-xl text-center md:text-left">{item.step}</h4>
                  <p className="text-green-700 text-center md:text-left">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section - Modern design */}
      <section id="team" className="py-20 px-6 bg-gradient-to-br from-green-50 to-white">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-block bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-medium">
              Our Team
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">Collaborators & Mentors</h2>
            <p className="text-lg text-green-700 max-w-3xl mx-auto">
              Meet the talented team behind our banana leaf disease detection project.
            </p>
          </div>

          {/* Researchers Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-center">Research Team</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((member) => (
                <div
                  key={member}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition group"
                >
                  <div className="aspect-square bg-green-100 relative overflow-hidden">
                    <img
                      src={`/api/placeholder/300/300`}
                      alt={`Team Member ${member}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h4 className="text-lg font-semibold">Researcher {member}</h4>
                    <p className="text-sm text-green-600">AI Specialist</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Professors Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-center">Project Guides</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {[
                {
                  name: "Dr. Expert One",
                  role: "Professor, Department of AI",
                },
                {
                  name: "Prof. Knowledgeable Two",
                  role: "Head of Research, ML Division",
                },
              ].map((prof, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-6 bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src={`/api/placeholder/200/200`}
                      alt={prof.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold">{prof.name}</h4>
                    <p className="text-green-700">{prof.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Project Report */}
          <div className="text-center">
            <a
              href="/report.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 rounded-xl text-white bg-gradient-to-r from-green-600 to-emerald-500 shadow-md hover:shadow-lg transition text-lg font-medium"
            >
              View Research Paper
            </a>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 mb-8">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-3xl p-12 shadow-xl relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute top-0 left-0 right-0 bottom-0 opacity-10">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full"></div>
            <div className="absolute top-10 left-20 w-20 h-20 bg-white rounded-full"></div>
            <div className="absolute bottom-10 right-20 w-32 h-32 bg-white rounded-full"></div>
          </div>

          <div className="relative z-10 text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to protect your banana crops?
            </h2>
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-green-50">
              Join thousands of farmers already using our AI-powered disease detection tool to improve crop health and yield.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/signin"
                className="px-8 py-3 rounded-xl bg-white text-green-600 text-lg font-semibold hover:bg-green-50 transition shadow-md hover:shadow-lg"
              >
                Launch Detector
              </a>
              <a
                href="#"
                className="px-8 py-3 rounded-xl bg-green-700/30 text-white text-lg font-semibold border border-white/30 hover:bg-green-700/50 transition"
              >
                Sign Up Free
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-green-50 pt-16 pb-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Leaf size={24} />
                <h3 className="text-xl font-bold">BananaLeaf AI</h3>
              </div>
              <p className="text-green-300 text-sm">
                AI-powered banana leaf disease detection for better crop management and increased yield.
              </p>
              <div className="flex gap-4">
                {/* Social Media Icons */}
                <a href="#" className="w-8 h-8 bg-green-800 rounded-full flex items-center justify-center hover:bg-green-700 transition">
                  <span className="text-xs font-bold">FB</span>
                </a>
                <a href="#" className="w-8 h-8 bg-green-800 rounded-full flex items-center justify-center hover:bg-green-700 transition">
                  <span className="text-xs font-bold">TW</span>
                </a>
                <a href="#" className="w-8 h-8 bg-green-800 rounded-full flex items-center justify-center hover:bg-green-700 transition">
                  <span className="text-xs font-bold">IG</span>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-green-300">
                <li><a href="#" className="hover:text-white transition">Home</a></li>
                <li><a href="#about" className="hover:text-white transition">About</a></li>
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><a href="#how" className="hover:text-white transition">How It Works</a></li>
                <li><a href="#team" className="hover:text-white transition">Our Team</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-green-300">
                <li><a href="#" className="hover:text-white transition">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition">API Access</a></li>
                <li><a href="#" className="hover:text-white transition">Disease Database</a></li>
                <li><a href="#" className="hover:text-white transition">Research Papers</a></li>
                <li><a href="#" className="hover:text-white transition">Treatment Guide</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-green-300">
                <li>Email: siva0327@gmail.com</li>
                <li>Phone: +91 9080360374</li>
                <li>Address: KITE - Saravanampatti</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-green-800 pt-8 text-center">
            <p className="text-green-400 text-sm">
              © {new Date().getFullYear()} BananaLeaf AI. All rights reserved. | Privacy Policy | Terms of Service
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}