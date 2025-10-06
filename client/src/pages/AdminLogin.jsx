import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { Lock, Mail } from 'lucide-react'
import { adminLogin } from "../apis/user.api";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from 'react-toastify';

const AdminLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      alert('Please fill in all fields')
      return
    }

    setLoading(true)

    try {
      const response = await axios.post(adminLogin, {
        email,
        password,
      });
      console.log("Login response:", response.data);

      Cookies.set("token", response.data.data.token);
      Cookies.set("userRole", response.data.data.admin.role);
      toast.success("Login successful!");
      setTimeout(() => {
        navigate('/admin/scoring');
      }, 2000);
    } catch (error) {
      // alert('Login failed. Please try again.')
      toast.error("Login failed. Please check your credentials.", error);
      console.log('Login error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="mx-auto h-12 w-12 sm:h-16 sm:w-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Team Scoring Login
            </h2>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Sign in to access the scoring system
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 sm:pr-4 py-2 sm:py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 sm:pr-4 py-2 sm:py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 sm:py-3 px-4 rounded-md font-medium text-sm sm:text-base text-white transition-colors ${loading
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin;