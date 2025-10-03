import React, { useState, useEffect } from 'react'
import { Users } from 'lucide-react'
import AdminNavbar from '../components/AdminNavbar'
import { teamRegister } from "../apis/user.api";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from 'react-toastify';


const Register = () => {
  const [teams, setTeams] = useState([])
  const [teamName, setTeamName] = useState('')
  const [leaderName, setLeaderName] = useState('')
  const [leaderEmail, setLeaderEmail] = useState('')

  const handleRegister = async () => {
    console.log("In handle register");

    if (!teamName || !leaderName || !leaderEmail) {
      alert('Please fill in all fields')
      return
    }

    const newTeam = {
      teamName,
      leaderName,
      leaderEmail
    }

    try {
      const token = Cookies.get('token');
      const response = await axios.post(teamRegister, newTeam, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = response.data;
      console.log("Team registered: ", data);
      toast.success(`Team registered successfully!`);

      // const tempTeam = {
      //   id: Date.now(),
      //   ...newTeam,
      //   teamCode: `TEAM${(teams.length + 1).toString().padStart(3, '0')}`
      // }
      // setTeams([...teams, tempTeam])
      // alert(`Team registered successfully! Team Code: ${tempTeam.teamCode}`)

      // setTeamName('')
      // setLeaderName('')
      // setLeaderEmail('')

    } catch (error) {

      console.log("Error in team register", error);

      if (error.response) {
        switch (error.response.status) {
          case 400:
            toast.error('Invalid request. Please check your input.');
            break;
          case 401:
            toast.error('Unauthorized. Please login again.');
            break;
          case 403:
            toast.error('Forbidden. You do not have permission to register teams.');
            break;
          case 409:
            toast.error('Team or email already exists.');
            break;
          case 429:
            toast.error('Too many requests. Please try again later.');
            break;
          case 500:
            toast.error('Server error. Please try again later.');
            break;
          default:
            toast.error('An error occurred while registering the team.');
        }
      }
      else if (error.request) {
        alert('No response from server. Please check your internet connection.');
      } else {
        alert('Error setting up the request. Please try again.');
      }
    }
  }

  return (
    <>
      <AdminNavbar />
      <div className="max-w-2xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <Users className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600" />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Team Registration</h2>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Team Name
              </label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base"
                placeholder="Enter team name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Team Leader Name
              </label>
              <input
                type="text"
                value={leaderName}
                onChange={(e) => setLeaderName(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base"
                placeholder="Enter leader name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Team Leader Email
              </label>
              <input
                type="email"
                value={leaderEmail}
                onChange={(e) => setLeaderEmail(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base"
                placeholder="Enter leader email"
              />
            </div>

            <button
              onClick={handleRegister}
              className="w-full bg-indigo-600 text-white py-2 sm:py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors font-medium text-sm sm:text-base"
            >
              Register Team
            </button>
          </div>

          {teams.length > 0 && (
            <div className="mt-6 sm:mt-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Registered Teams</h3>
              <div className="space-y-3">
                {teams.map((team) => (
                  <div key={team.id} className="bg-gray-50 p-3 sm:p-4 rounded-md border border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{team.teamName}</p>
                        <p className="text-xs sm:text-sm text-gray-600 truncate">{team.leaderName}</p>
                        <p className="text-xs sm:text-sm text-gray-500 truncate">{team.leaderEmail}</p>
                      </div>
                      <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs sm:text-sm font-medium self-start">
                        {team.teamCode}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Register