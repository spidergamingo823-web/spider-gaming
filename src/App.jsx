import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import Browse from './pages/Browse.jsx'

function RequireUser({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return children
}

function RequireAdmin({ children }) {
  const { user } = useAuth()
  if (!user || user.role !== 'admin') return <Navigate to="/admin-login" replace />
  return children
}

function RedirectIfAuthed({ children }) {
  const { user } = useAuth()
  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/'} replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<RedirectIfAuthed><Login /></RedirectIfAuthed>} />
      <Route path="/signup" element={<RedirectIfAuthed><Signup /></RedirectIfAuthed>} />
      <Route path="/admin-login" element={<RedirectIfAuthed><AdminLogin /></RedirectIfAuthed>} />
      <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
      <Route path="/" element={<RequireUser><Browse /></RequireUser>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}