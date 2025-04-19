"use client";

import React, { useState, useEffect, FormEvent } from "react";
import DashboardLayout from "../dashboard/components/DashboardLayout";
import { Calendar, FileText, Download, Menu, X, Filter, Clock, Zap } from "lucide-react";

// Retrieve the base URL from environment variables
const baseURL = process.env.NEXT_PUBLIC_API_BASEURL;

export default function ReportGenerationPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reportType, setReportType] = useState("transactions");
  const [reportFormat, setReportFormat] = useState("pdf");
  const [message, setMessage] = useState<{ text: string; type: "error" | "success" | "" }>({ text: "", type: "" });
  const [customFilters, setCustomFilters] = useState<{ [key: string]: string }>({});

  // Predefined date ranges
  const [datePreset, setDatePreset] = useState("");

  useEffect(() => {
    // Set date presets when selected
    if (datePreset) {
      const today = new Date();
      let fromDateObj = new Date();

      switch (datePreset) {
        case "today":
          setFromDate(formatDate(today));
          setToDate(formatDate(today));
          break;
        case "yesterday":
          fromDateObj.setDate(today.getDate() - 1);
          setFromDate(formatDate(fromDateObj));
          setToDate(formatDate(fromDateObj));
          break;
        case "last7days":
          fromDateObj.setDate(today.getDate() - 6);
          setFromDate(formatDate(fromDateObj));
          setToDate(formatDate(today));
          break;
        case "last30days":
          fromDateObj.setDate(today.getDate() - 29);
          setFromDate(formatDate(fromDateObj));
          setToDate(formatDate(today));
          break;
        case "thisMonth":
          fromDateObj = new Date(today.getFullYear(), today.getMonth(), 1);
          setFromDate(formatDate(fromDateObj));
          setToDate(formatDate(today));
          break;
        case "lastMonth":
          // First day of previous month
          const firstDay = new Date(today.getFullYear(), today.getMonth() - 1, 1);
          // Last day of previous month
          const lastDay = new Date(today.getFullYear(), today.getMonth(), 0);
          setFromDate(formatDate(firstDay));
          setToDate(formatDate(lastDay));
          break;
      }
    }
  }, [datePreset]);

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const getReportTypeFilters = () => {
    switch (reportType) {
      case "transactions":
        return (
          <>
            <div className="mb-4">
              <label className="block mb-2 font-medium text-black">Payment Status</label>
              <select
                value={customFilters.paymentStatus || ""}
                onChange={(e) => setCustomFilters({ ...customFilters, paymentStatus: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white text-black"
              >
                <option value="">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-medium text-black">Transaction Type</label>
              <select
                value={customFilters.transactionType || ""}
                onChange={(e) => setCustomFilters({ ...customFilters, transactionType: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white text-black"
              >
                <option value="">All Types</option>
                <option value="sale">Sale</option>
                <option value="refund">Refund</option>
                <option value="subscription">Subscription</option>
              </select>
            </div>
          </>
        );
      case "orders":
        return (
          <>
            <div className="mb-4">
              <label className="block mb-2 font-medium text-black">Order Status</label>
              <select
                value={customFilters.orderStatus || ""}
                onChange={(e) => setCustomFilters({ ...customFilters, orderStatus: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white text-black"
              >
                <option value="">All Statuses</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </>
        );
      case "products":
        return (
          <>
            <div className="mb-4">
              <label className="block mb-2 font-medium text-black">Category</label>
              <select
                value={customFilters.category || ""}
                onChange={(e) => setCustomFilters({ ...customFilters, category: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white text-black"
              >
                <option value="">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="food">Food & Beverage</option>
                <option value="home">Home & Garden</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-medium text-black">Stock Status</label>
              <select
                value={customFilters.stockStatus || ""}
                onChange={(e) => setCustomFilters({ ...customFilters, stockStatus: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white text-black"
              >
                <option value="">All</option>
                <option value="inStock">In Stock</option>
                <option value="lowStock">Low Stock</option>
                <option value="outOfStock">Out of Stock</option>
              </select>
            </div>
          </>
        );
      case "shops":
        return (
          <>
            <div className="mb-4">
              <label className="block mb-2 font-medium text-black">Shop Status</label>
              <select
                value={customFilters.shopStatus || ""}
                onChange={(e) => setCustomFilters({ ...customFilters, shopStatus: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white text-black"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending Approval</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-medium text-black">Region</label>
              <select
                value={customFilters.region || ""}
                onChange={(e) => setCustomFilters({ ...customFilters, region: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white text-black"
              >
                <option value="">All Regions</option>
                <option value="north">North</option>
                <option value="south">South</option>
                <option value="east">East</option>
                <option value="west">West</option>
              </select>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const handleDownload = async (e: FormEvent) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    setIsLoading(true);

    try {
      const payload = {
        fromDate,
        toDate,
        reportType,
        reportFormat,
        filters: customFilters
      };

      const res = await fetch(`${baseURL}/api/reports/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setMessage({ text: errorData.error || "Error generating report", type: "error" });
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${reportType}_report_${fromDate}_to_${toDate}.${reportFormat}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      setMessage({ text: "Report downloaded successfully!", type: "success" });
    } catch (error) {
      console.error("Error:", error);
      setMessage({ text: "Server error", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    setActiveStep(curr => Math.min(curr + 1, 3));
  };

  const prevStep = () => {
    setActiveStep(curr => Math.max(curr - 1, 1));
  };

  return (
    <DashboardLayout>
      <div className="flex min-h-screen relative">
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-20"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        <div className="flex-1 transition-all duration-300 w-full py-4 px-6 md:px-10">
          {/* Hamburger Menu for Mobile */}
          <div className="sticky top-0 z-10 bg-white shadow-sm p-4 flex justify-between items-center md:hidden">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md bg-slate-50 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-xl font-bold text-black">Report Generation</h1>
            <div className="w-10"></div> {/* Spacer for alignment */}
          </div>

          <div className="p-2 sm:p-2 lg:p-0.5">
            <div className="max-w-1xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100 transform transition-all hover:shadow-xl">
                <div className="flex items-center mb-6 border-b pb-4">
                  <div className="bg-blue-600 p-3 rounded-lg mr-4">
                    <FileText className="text-white" size={24} />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-black">Report Generation</h1>
                </div>

                {message.text && (
                  <div
                    className={`p-4 mb-6 rounded-lg flex items-center ${message.type === "error"
                      ? "bg-red-50 text-red-700 border-l-4 border-red-500"
                      : "bg-green-50 text-green-700 border-l-4 border-green-500"
                      }`}
                  >
                    {message.text}
                  </div>
                )}

                {/* Progress Stepper */}
                <div className="mb-8">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activeStep >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
                        }`}>
                        <Calendar size={18} />
                      </div>
                      <span className="mt-2 text-sm font-medium text-black">Date Range</span>
                    </div>
                    <div className={`flex-1 h-1 mx-2 ${activeStep >= 2 ? "bg-blue-600" : "bg-gray-200"}`}></div>
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activeStep >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
                        }`}>
                        <Filter size={18} />
                      </div>
                      <span className="mt-2 text-sm font-medium text-black">Filters</span>
                    </div>
                    <div className={`flex-1 h-1 mx-2 ${activeStep >= 3 ? "bg-blue-600" : "bg-gray-200"}`}></div>
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activeStep >= 3 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
                        }`}>
                        <Download size={18} />
                      </div>
                      <span className="mt-2 text-sm font-medium text-black">Generate</span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleDownload} className="space-y-6">
                  {activeStep === 1 && (
                    <div className="space-y-6">
                      <div className="mb-6">
                        <label className="block mb-2 font-medium text-black">Quick Date Presets</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                          {[
                            { id: "today", label: "Today", icon: <Clock size={14} /> },
                            { id: "yesterday", label: "Yesterday", icon: <Clock size={14} /> },
                            { id: "last7days", label: "Last 7 Days", icon: <Calendar size={14} /> },
                            { id: "last30days", label: "Last 30 Days", icon: <Calendar size={14} /> },
                            { id: "thisMonth", label: "This Month", icon: <Calendar size={14} /> },
                            { id: "lastMonth", label: "Last Month", icon: <Calendar size={14} /> },
                          ].map((preset) => (
                            <button
                              key={preset.id}
                              type="button"
                              onClick={() => setDatePreset(preset.id)}
                              className={`flex items-center justify-center py-2 px-3 rounded-lg text-sm font-medium transition-all ${datePreset === preset.id
                                ? "bg-blue-600 text-white shadow-md"
                                : "bg-gray-100 text-black hover:bg-gray-200"
                                }`}
                            >
                              <span className="mr-2">{preset.icon}</span>
                              {preset.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative">
                          <label className="block mb-2 font-medium text-black">From Date</label>
                          <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Calendar className="text-gray-400" size={18} />
                            </div>
                            <input
                              type="date"
                              className="w-full border border-gray-300 rounded-lg px-10 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-black"
                              value={fromDate}
                              onChange={(e) => {
                                setFromDate(e.target.value);
                                setDatePreset("");
                              }}
                              required
                            />
                          </div>
                        </div>
                        <div className="relative">
                          <label className="block mb-2 font-medium text-black">To Date</label>
                          <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Calendar className="text-gray-400" size={18} />
                            </div>
                            <input
                              type="date"
                              className="w-full border border-gray-300 rounded-lg px-10 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-black"
                              value={toDate}
                              onChange={(e) => {
                                setToDate(e.target.value);
                                setDatePreset("");
                              }}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeStep === 2 && (
                    <div className="space-y-6">
                      <div>
                        <label className="block mb-2 font-medium text-black">Report Type</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                          {[
                            { id: "transactions", label: "Transactions", icon: <Zap size={16} className="text-green-500" /> },
                            { id: "orders", label: "Orders", icon: <FileText size={16} className="text-yellow-500" /> },
                            { id: "shops", label: "Shops", icon: <Menu size={16} className="text-red-500" /> },
                            { id: "products", label: "Products", icon: <Filter size={16} className="text-violet-500" /> }
                          ].map((type) => (
                            <div
                              key={type.id}
                              onClick={() => setReportType(type.id)}
                              className={`cursor-pointer p-4 rounded-lg border-2 transition-all flex items-center ${reportType === type.id
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                                }`}
                            >
                              <div
                                className={`p-2 rounded-full mr-3 ${reportType === type.id ? "bg-blue-100" : "bg-gray-100"
                                  }`}
                              >
                                {type.icon}
                              </div>
                              <span className="font-medium text-black">{type.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium text-lg mb-4 text-black">Additional Filters</h3>
                        {getReportTypeFilters()}
                      </div>
                    </div>
                  )}


                  {activeStep === 3 && (
                    <div className="space-y-6">
                      <div className="bg-blue-50 p-6 rounded-lg mb-6">
                        <h3 className="font-medium text-lg mb-4 text-black">Report Summary</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Date Range</p>
                            <p className="text-black font-medium">{fromDate} to {toDate}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Report Type</p>
                            <p className="text-black font-medium capitalize">{reportType}</p>
                          </div>
                          {Object.keys(customFilters).length > 0 && (
                            <div className="col-span-1 md:col-span-2">
                              <p className="text-sm text-gray-500 mb-1">Applied Filters</p>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {Object.entries(customFilters).map(([key, value]) => (
                                  value && (
                                    <span key={key} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: {value.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                    </span>
                                  )
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block mb-2 font-medium text-black">Report Format</label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { id: "pdf", label: "PDF Document" },
                            { id: "xlsx", label: "Excel Spreadsheet" },
                            { id: "csv", label: "CSV File" }
                          ].map((format) => (
                            <div
                              key={format.id}
                              onClick={() => setReportFormat(format.id)}
                              className={`cursor-pointer p-4 rounded-lg border-2 transition-all text-center ${reportFormat === format.id
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                                }`}
                            >
                              <span className="font-medium text-black">{format.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between mt-8 pt-4 border-t">
                    {activeStep > 1 ? (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="px-6 py-3 bg-gray-200 text-black rounded-lg hover:bg-gray-300 focus:ring-4 focus:ring-gray-200 transition-all"
                      >
                        Back
                      </button>
                    ) : (
                      <div></div> // Empty div for flex spacing
                    )}

                    {activeStep < 3 ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all shadow-md hover:shadow-lg"
                      >
                        Continue
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all disabled:opacity-70 shadow-md hover:shadow-lg"
                      >
                        {isLoading ? (
                          <span className="inline-flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </span>
                        ) : (
                          <span className="inline-flex items-center">
                            <Download className="mr-2" size={20} />
                            Generate Report
                          </span>
                        )}
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}