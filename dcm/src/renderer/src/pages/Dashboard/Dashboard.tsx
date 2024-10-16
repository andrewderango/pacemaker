import React, { useEffect, useState } from 'react'
import LogoutButton from '../../components/LogOut/LogOut'
import TerminateButton from '../../components/Terminate/Terminate'
import { useUser } from '../../context/UserContext'
import { Activity } from 'lucide-react'
import heartflowLogo from '../../assets/heartflow.png'
import './Dashboard.css'

function Dashboard(): JSX.Element {
  const { user } = useUser()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [communicationStatus, setCommunicationStatus] = useState('CONNECTED')

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <img alt="logo" className="logo-sidebar" src={heartflowLogo} />
        <div className="welcome-section">
          <p className="welcome-header">Welcome</p>
          {user && <p className="username">{user.username}</p>}
        </div>
        <div className="sidebar-section">
          <p className="communication-status-header">Telemetry Status</p>
          <p className="communication-status">
            <Activity size={16} className="activity-icon" />
            {communicationStatus}
          </p>
        </div>
        <div className="sidebar-time">
          <p className="current-date">
            {currentTime.toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
            </p>
          <p className="current-time">{currentTime.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: 'numeric',
              // second: 'numeric',
              hour12: true,
            })}
          </p>
        </div>
        <div className="bottom-sidebar-components">
          <div className="sidebar-versions">
            <p>HeartFlow Release: v1.0.0</p>
            {user && <p>Serial Number: {user.serialNumber}</p>}
          </div>
          <div className="logout-button-container">
            <LogoutButton />
          </div>
          <div className="terminate-button-container">
            <TerminateButton />
          </div>
        </div>
      </div>
      <div className="main-content">
        <h1>Dashboard</h1>
        {user && <p>Welcome, {user.username}!</p>}
        {user && <p>Your serial number is {user.serialNumber}</p>}
      </div>
      <div className="right-sidebar">
        <h2>Right Sidebar</h2>
        <p>Additional content can go here.</p>
      </div>
    </div>
  )
}

export default Dashboard