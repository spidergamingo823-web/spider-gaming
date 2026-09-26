import React, { useState } from 'react'
import { fmtDate, ytId } from '../utils/helpers'

export default function ModModal({ mod, onClose }) {
  const allImages = [mod.thumb, ...(mod.images || [])]
  const [active, setActive] = useState(mod.thumb)
  const yid = mod.yt ? ytId(mod.yt) : null

  return (
    <div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,.7)' }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content modal-content-sg p-3">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h4 className="mb-1">{mod.name}</h4>
              <span className="badge-sg me-2">v{mod.version}</span>
              <span className="meta">Uploaded: {fmtDate(mod.uploadedAt)}</span>
            </div>
            <button className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <img src={active} className="w-100 mt-3 rounded" style={{ maxHeight: 320, objectFit: 'cover' }} />

          {allImages.length > 1 && (
            <div className="thumbs mt-3">
              {allImages.map((img, i) => (
                <img key={i} src={img} className={active === img ? 'sel' : ''} onClick={() => setActive(img)} />
              ))}
            </div>
          )}

          {yid && (
            <div className="yt-wrap mt-3">
              <iframe src={`https://www.youtube.com/embed/${yid}`} allowFullScreen></iframe>
            </div>
          )}

          {mod.desc && <p className="mt-3" style={{ color: 'var(--muted)', lineHeight: 1.6 }}>{mod.desc}</p>}

          <div className="d-flex gap-2 flex-wrap mt-2">
            {mod.source && (
              <a href={mod.source} target="_blank" rel="noreferrer" className="btn-sg-ghost">🔗 Visit Source</a>
            )}
            <a href={mod.thumb} download={`${mod.name}.png`} className="btn-sg-main">⬇ Download</a>
          </div>
        </div>
      </div>
    </div>
  )
}
