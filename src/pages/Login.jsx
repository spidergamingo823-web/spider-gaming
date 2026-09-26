import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Logo from '../components/Logo.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [err, setErr] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const res = login(form.username, form.password)
    if (!res.ok) { setErr(res.error); return }
    navigate('/')
  }

  return (
    <div className="auth-wrap">
      <div className="card-sg auth-card">
        <div className="d-flex justify-content-center mb-2"><Logo size={44} /></div>
        <div className="auth-title">SPIDER GAMING 2.0</div>
        <div className="auth-sub">Welcome back, player</div>
        <form onSubmit={submit}>
          <label className="sg-label">Username</label>
          <input className="form-control-sg" value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })} />
          <label className="sg-label">Password</label>
          <input type="password" className="form-control-sg" value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })} />
          {err && <div className="text-danger text-center mt-2" style={{ fontSize: '.8rem' }}>{err}</div>}
          <button className="btn-sg-main w-100 mt-4">Login</button>
        </form>
        <div className="text-center mt-3" style={{ fontSize: '.8rem', color: 'var(--muted)' }}>
          No account? <Link to="/signup" style={{ color: 'var(--accent2)', fontWeight: 700 }}>Sign up</Link>
        </div>
        <div className="text-center mt-2" style={{ fontSize: '.7rem' }}>
          <Link to="/admin-login" style={{ color: 'var(--muted)' }}>Admin login →</Link>
        </div>
      </div>
    </div>
  )
}
