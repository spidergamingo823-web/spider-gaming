import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Logo from './Logo.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="navbar-sg">
      <div className="logo d-flex align-items-center gap-2">
        <Logo size={32} /><span> SPIDER GAMING</span> 2.0
      </div>
      {user && (
        <div className="d-flex align-items-center gap-2">
          <span style={{ fontSize: '.8rem', color: 'var(--muted)' }}>
            {user.username} · {user.role}
          </span>
          <button className="btn-sg-ghost" onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  )
}
