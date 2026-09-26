import React from 'react'
import { fmtDate } from '../utils/helpers'

export default function ModCard({ mod, onClick }) {
  return (
    <div className="mcard" onClick={onClick}>
      <img src={mod.thumb} alt={mod.name} />
      <div className="body">
        <h3 className="h6 mb-2">{mod.name}</h3>
        <span className="badge-sg me-1">v{mod.version}</span>
        {mod.category && <span className="badge-sg" style={{ background: 'var(--bg2)', color: 'var(--muted)', border: '1px solid var(--border)' }}>{mod.category}</span>}
        <div className="meta">Uploaded: {fmtDate(mod.uploadedAt)}</div>
      </div>
    </div>
  )
}
