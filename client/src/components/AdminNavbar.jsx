import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Users, Trophy, BarChart3 } from 'lucide-react'

const Navbar = () => {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <h1 className="text-lg sm:text-xl font-bold text-indigo-600">
              CELESTIA
            </h1>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-2 sm:space-x-8 overflow-x-auto">
            <Link
              to="/admin/register"
              className={`inline-flex items-center px-3 sm:px-4 py-2 border-b-2 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                isActive('/register')
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users className="mr-1 sm:mr-2 h-4 w-4" />
              Register
            </Link>

            <Link
              to="/admin/scoring"
              className={`inline-flex items-center px-3 sm:px-4 py-2 border-b-2 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                isActive('/scoring')
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Trophy className="mr-1 sm:mr-2 h-4 w-4" />
              Scoring
            </Link>

            <Link
              to="/leaderboard"
              className={`inline-flex items-center px-3 sm:px-4 py-2 border-b-2 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                isActive('/leaderboard')
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BarChart3 className="mr-1 sm:mr-2 h-4 w-4" />
              Leaderboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar