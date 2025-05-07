"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "./components/DashboardLayout";
import {
  Leaf,
  TrendingUp,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Activity,
  Clock,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

// ✅ Define types
type RecentActivityItem = {
  id: number;
  type: string;
  result: string;
  date: string;
  imageName: string;
  confidence: number;
};

type DiseaseDistributionItem = {
  disease: string;
  count: number;
  color: string;
};

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalScans: 0,
    healthyLeaves: 0,
    diseasedLeaves: 0,
    pendingAnalysis: 0,
  });

  const [recentActivity, setRecentActivity] = useState<RecentActivityItem[]>([]);
  const [diseaseDistribution, setDiseaseDistribution] = useState<DiseaseDistributionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalScans: 142,
        healthyLeaves: 93,
        diseasedLeaves: 42,
        pendingAnalysis: 7,
      });

      setRecentActivity([
        {
          id: 1,
          type: "scan",
          result: "Healthy",
          date: "2 hours ago",
          imageName: "banana_leaf_12.jpg",
          confidence: 97,
        },
        {
          id: 2,
          type: "scan",
          result: "Sigatoka Disease",
          date: "3 hours ago",
          imageName: "farm_sample_7.jpg",
          confidence: 89,
        },
        {
          id: 3,
          type: "scan",
          result: "Healthy",
          date: "5 hours ago",
          imageName: "plantation_east_4.jpg",
          confidence: 95,
        },
        {
          id: 4,
          type: "scan",
          result: "Panama Disease",
          date: "Yesterday",
          imageName: "field_sample_19.jpg",
          confidence: 91,
        },
        {
          id: 5,
          type: "scan",
          result: "Black Leaf Streak",
          date: "Yesterday",
          imageName: "section_b_plant_3.jpg",
          confidence: 86,
        },
      ]);

      setDiseaseDistribution([
        { disease: "Healthy", count: 93, color: "bg-green-500" },
        { disease: "Sigatoka", count: 21, color: "bg-amber-500" },
        { disease: "Panama Disease", count: 15, color: "bg-red-500" },
        { disease: "Black Leaf Streak", count: 6, color: "bg-purple-500" },
        { disease: "Others", count: 7, color: "bg-blue-500" },
      ]);

      setIsLoading(false);
    }, 1000);
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const weeklyChanges = {
    scans: 12.8,
    healthy: 5.2,
    diseased: -3.7,
    pending: 2.1,
  };

  // ✅ Add parameter type
  const renderTrend = (value: number) => {
    if (value > 0) {
      return (
        <div className="flex items-center text-green-600">
          <ArrowUpRight className="h-4 w-4 mr-1" />
          <span className="text-xs font-medium">{value.toFixed(1)}%</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center text-red-600">
          <ArrowDownRight className="h-4 w-4 mr-1" />
          <span className="text-xs font-medium">{Math.abs(value).toFixed(1)}%</span>
        </div>
      );
    }
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center mb-2">
              <Leaf className="h-6 w-6 text-green-500 mr-2" />
              <h1 className="text-2xl font-bold text-gray-800">Banana Leaf Health Dashboard</h1>
            </div>
            <p className="text-gray-600">{today}</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button 
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 flex items-center"
              onClick={() => window.open('/predict', '_self')}
            >
              <Leaf className="h-4 w-4 text-green-500 mr-2" />
              <span>New Scan</span>
            </button>
            
            <button 
              className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-sm hover:bg-green-600 flex items-center"
              onClick={() => window.open('/reports', '_self')}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              <span>View Reports</span>
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        // Loading state
        <div className="grid place-items-center h-64">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            <p className="mt-4 text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Scans</p>
                  <h3 className="text-2xl font-bold text-gray-800">{stats.totalScans}</h3>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <Activity className="h-6 w-6 text-blue-500" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>This week</span>
                </div>
                {renderTrend(weeklyChanges.scans)}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Healthy Leaves</p>
                  <h3 className="text-2xl font-bold text-gray-800">{stats.healthyLeaves}</h3>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>This week</span>
                </div>
                {renderTrend(weeklyChanges.healthy)}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Diseased Leaves</p>
                  <h3 className="text-2xl font-bold text-gray-800">{stats.diseasedLeaves}</h3>
                </div>
                <div className="bg-red-50 p-3 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>This week</span>
                </div>
                {renderTrend(weeklyChanges.diseased)}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Pending Analysis</p>
                  <h3 className="text-2xl font-bold text-gray-800">{stats.pendingAnalysis}</h3>
                </div>
                <div className="bg-amber-50 p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-amber-500" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>This week</span>
                </div>
                {renderTrend(weeklyChanges.pending)}
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Disease Distribution Chart */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Disease Distribution</h2>
                <button className="text-sm text-green-600 hover:text-green-700 flex items-center">
                  <span>View Details</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
              
              <div className="space-y-5">
                {diseaseDistribution.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">{item.disease}</span>
                      <span className="text-sm text-gray-500">{item.count} leaves</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div 
                        className={`${item.color} h-2.5 rounded-full`} 
                        style={{ width: `${(item.count / stats.totalScans) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-center text-sm text-gray-500">
                  <div className="mr-4 flex items-center">
                    <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                    <span>Healthy</span>
                  </div>
                  <div className="mr-4 flex items-center">
                    <span className="inline-block w-3 h-3 rounded-full bg-amber-500 mr-2"></span>
                    <span>Sigatoka</span>
                  </div>
                  <div className="mr-4 flex items-center">
                    <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                    <span>Panama</span>
                  </div>
                  <div className="mr-4 flex items-center">
                    <span className="inline-block w-3 h-3 rounded-full bg-purple-500 mr-2"></span>
                    <span>Black Streak</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
                <button className="text-sm text-green-600 hover:text-green-700 flex items-center">
                  <span>View All</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
              
              <div className="space-y-5">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start">
                    <div className={`p-2 rounded-lg mr-3 ${
                      activity.result === 'Healthy' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <Leaf className={`h-5 w-5 ${
                        activity.result === 'Healthy' ? 'text-green-600' : 'text-red-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium text-gray-900">{activity.result}</p>
                        <span className="text-xs text-gray-500">{activity.date}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.imageName} 
                        <span className="ml-1 bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full">
                          {activity.confidence}% confidence
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-6 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 text-sm rounded-lg transition-colors">
                Load More
              </button>
            </div>
          </div>

          {/* Quick Actions Section */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl p-6 flex flex-col justify-between shadow-md">
              <div>
                <h3 className="text-xl font-semibold mb-2">Need help with diagnosis?</h3>
                <p className="text-green-50 mb-6">Get expert advice from our AI assistant to identify and treat banana leaf diseases.</p>
              </div>
              <button 
                className="bg-white text-green-600 hover:bg-green-50 px-4 py-2 rounded-lg font-medium flex items-center justify-center"
                onClick={() => window.open('/chatbot', '_self')}
              >
                Ask AI Assistant
              </button>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Your Plantations</h3>
                <p className="text-gray-600 mb-4">You have 3 plantation areas registered for monitoring.</p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">East Field</span>
                    <span className="font-medium text-green-600">Healthy</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">West Field</span>
                    <span className="font-medium text-amber-600">Minor Issues</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">South Plantation</span>
                    <span className="font-medium text-red-600">Attention Needed</span>
                  </div>
                </div>
              </div>
              <button 
                className="text-green-600 hover:text-green-700 text-sm flex items-center justify-center"
                onClick={() => window.open('/plantations', '_self')}
              >
                Manage Plantations
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Treatment Recommendations</h3>
                <p className="text-gray-600 mb-4">Based on your recent scans, we recommend:</p>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2">•</span>
                    <span>Apply fungicide to West Field sections A & B</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    <span>Immediate treatment required for South Plantation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span>Regular monitoring for East Field</span>
                  </li>
                </ul>
              </div>
              <button 
                className="text-green-600 hover:text-green-700 text-sm flex items-center justify-center"
                onClick={() => window.open('/treatments', '_self')}
              >
                View All Recommendations
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}