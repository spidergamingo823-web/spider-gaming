import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { fileToBase64, fmtDate } from '../utils/helpers'

function UploadForm({ addMod, categories }) {
  const [f, setF] = useState({ name: '', version: '', desc: '', source: '', yt: '', category: categories[0]?.name || '' })
  const [thumb, setThumb] = useState(null)
  const [images, setImages] = useState([])

  // Keep category in sync with the live categories list -- fixes cases where
  // the form mounted before a category existed and the field was left empty.
  useEffect(() => {
    if (categories.length > 0 && !categories.find(c => c.name === f.category)) {
      setF(prev => ({ ...prev, category: categories[0].name }))
    }
  }, [categories])

  const handleThumb = async (e) => {
    if (e.target.files[0]) setThumb(await fileToBase64(e.target.files[0]))
  }

  const addImages = async (e) => {
    const files = Array.from(e.target.files)
    const b64s = await Promise.all(files.map(fileToBase64))
    setImages([...images, ...b64s])
  }

  const removeImage = (i) => setImages(images.filter((_, j) => j !== i))

  const submit = (e) => {
    e.preventDefault()
    if (!f.name || !f.version || !thumb) {
      alert('Mod Name, Version and Thumbnail are required')
      return
    }
    if (categories.length === 0) {
      alert('Please add a category first, in the Categories tab')
      return
    }
    if (!f.category) {
      alert('Please select a category')
      return
    }
    addMod({ ...f, thumb, images, id: Date.now(), uploadedAt: new Date().toISOString() })
    setF({ name: '', version: '', desc: '', source: '', yt: '', category: categories[0]?.name || '' })
    setThumb(null)
    setImages([])
    alert('Mod uploaded!')
  }

  return (
    <div className="card-sg mb-4">
      <h4 className="mb-3">Upload New Mod</h4>
      <form onSubmit={submit}>
        <div className="row">
          <div className="col-md-6">
            <label className="sg-label">Mod Name *</label>
            <input className="form-control-sg" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} />
          </div>
          <div className="col-md-6">
            <label className="sg-label">Mod Version *</label>
            <input className="form-control-sg" value={f.version} onChange={e => setF({ ...f, version: e.target.value })} />
          </div>
          <div className="col-12">
            <label className="sg-label">Category *</label>
            {categories.length === 0 ? (
              <div style={{ fontSize: '.8rem', color: 'var(--muted)' }}>
                No categories yet — add one in the <strong>Categories</strong> tab first.
              </div>
            ) : (
              <select className="form-control-sg" value={f.category} onChange={e => setF({ ...f, category: e.target.value })}>
                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            )}
          </div>
          <div className="col-12">
            <label className="sg-label">Description</label>
            <textarea className="form-control-sg" rows="3" value={f.desc} onChange={e => setF({ ...f, desc: e.target.value })} />
          </div>
          <div className="col-12">
            <label className="sg-label">Source Type (link to original mod)</label>
            <input className="form-control-sg" placeholder="https://..." value={f.source} onChange={e => setF({ ...f, source: e.target.value })} />
          </div>
          <div className="col-12">
            <label className="sg-label">YouTube Preview URL</label>
            <input className="form-control-sg" placeholder="https://youtube.com/watch?v=..." value={f.yt} onChange={e => setF({ ...f, yt: e.target.value })} />
          </div>
          <div className="col-12">
            <label className="sg-label">Thumbnail Image * (main image shown to users)</label>
            <input type="file" accept="image/*" className="form-control-sg" onChange={handleThumb} />
            {thumb && <div className="imgrow"><div className="imgchip"><img src={thumb} /></div></div>}
          </div>
          <div className="col-12">
            <label className="sg-label">Additional Images</label>
            <input type="file" accept="image/*" multiple className="form-control-sg" onChange={addImages} />
            <div className="imgrow">
              {images.map((img, i) => (
                <div className="imgchip" key={i}>
                  <img src={img} />
                  <div className="rm" onClick={() => removeImage(i)}>×</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <button className="btn-sg-main mt-4">⬆ Upload Mod</button>
      </form>
    </div>
  )
}

function EditModModal({ mod, categories, onSave, onClose }) {
  const [f, setF] = useState({
    name: mod.name, version: mod.version, desc: mod.desc || '',
    source: mod.source || '', yt: mod.yt || '', category: mod.category || categories[0]?.name || ''
  })
  const [thumb, setThumb] = useState(mod.thumb)
  const [images, setImages] = useState(mod.images || [])

  const handleThumb = async (e) => {
    if (e.target.files[0]) setThumb(await fileToBase64(e.target.files[0]))
  }
  const addImages = async (e) => {
    const files = Array.from(e.target.files)
    const b64s = await Promise.all(files.map(fileToBase64))
    setImages([...images, ...b64s])
  }
  const removeImage = (i) => setImages(images.filter((_, j) => j !== i))

  const save = (e) => {
    e.preventDefault()
    if (!f.name || !f.version || !thumb) {
      alert('Mod Name, Version and Thumbnail are required')
      return
    }
    onSave({ ...f, thumb, images })
  }

  return (
    <div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,.7)' }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content modal-content-sg p-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h4 className="mb-0">Edit Mod</h4>
            <button className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <form onSubmit={save}>
            <div className="row">
              <div className="col-md-6">
                <label className="sg-label">Mod Name *</label>
                <input className="form-control-sg" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} />
              </div>
              <div className="col-md-6">
                <label className="sg-label">Mod Version *</label>
                <input className="form-control-sg" value={f.version} onChange={e => setF({ ...f, version: e.target.value })} />
              </div>
              <div className="col-12">
                <label className="sg-label">Category *</label>
                <select className="form-control-sg" value={f.category} onChange={e => setF({ ...f, category: e.target.value })}>
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div className="col-12">
                <label className="sg-label">Description</label>
                <textarea className="form-control-sg" rows="3" value={f.desc} onChange={e => setF({ ...f, desc: e.target.value })} />
              </div>
              <div className="col-12">
                <label className="sg-label">Source Type (link to original mod)</label>
                <input className="form-control-sg" value={f.source} onChange={e => setF({ ...f, source: e.target.value })} />
              </div>
              <div className="col-12">
                <label className="sg-label">YouTube Preview URL</label>
                <input className="form-control-sg" value={f.yt} onChange={e => setF({ ...f, yt: e.target.value })} />
              </div>
              <div className="col-12">
                <label className="sg-label">Thumbnail Image *</label>
                <input type="file" accept="image/*" className="form-control-sg" onChange={handleThumb} />
                {thumb && <div className="imgrow"><div className="imgchip"><img src={thumb} /></div></div>}
              </div>
              <div className="col-12">
                <label className="sg-label">Additional Images</label>
                <input type="file" accept="image/*" multiple className="form-control-sg" onChange={addImages} />
                <div className="imgrow">
                  {images.map((img, i) => (
                    <div className="imgchip" key={i}>
                      <img src={img} />
                      <div className="rm" onClick={() => removeImage(i)}>×</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="d-flex gap-2 mt-4">
              <button type="submit" className="btn-sg-main">Save Changes</button>
              <button type="button" className="btn-sg-ghost" onClick={onClose}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

function ManageList({ mods, deleteMod, categories, updateMod }) {
  const [editing, setEditing] = useState(null)

  return (
    <div className="card-sg">
      <h4 className="mb-3">Manage Mods ({mods.length})</h4>
      {mods.length === 0 ? (
        <div className="empty-sg">No mods uploaded yet.</div>
      ) : (
        <div className="table-responsive">
          <table className="table-sg">
            <thead>
              <tr><th>Thumb</th><th>Name</th><th>Category</th><th>Version</th><th>Uploaded</th><th></th></tr>
            </thead>
            <tbody>
              {mods.map(m => (
                <tr key={m.id}>
                  <td><img src={m.thumb} /></td>
                  <td>{m.name}</td>
                  <td><span className="badge-sg">{m.category || '—'}</span></td>
                  <td>v{m.version}</td>
                  <td>{fmtDate(m.uploadedAt)}</td>
                  <td className="d-flex gap-2">
                    <button className="btn-sg-ghost" onClick={() => setEditing(m)}>Edit</button>
                    <button className="btn-sg-danger" onClick={() => deleteMod(m.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {editing && (
        <EditModModal
          mod={editing}
          categories={categories}
          onClose={() => setEditing(null)}
          onSave={(updates) => { updateMod(editing.id, updates); setEditing(null) }}
        />
      )}
    </div>
  )
}

function CategoryManager({ categories, addCategory, deleteCategory, mods }) {
  const [name, setName] = useState('')
  const [err, setErr] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const res = addCategory(name)
    if (!res.ok) { setErr(res.error); return }
    setErr('')
    setName('')
  }

  const countFor = (catName) => mods.filter(m => m.category === catName).length

  return (
    <div className="card-sg">
      <h4 className="mb-3">Categories</h4>
      <form onSubmit={submit} className="d-flex gap-2 flex-wrap mb-4">
        <input
          className="form-control-sg"
          style={{ maxWidth: 260 }}
          placeholder="e.g. Maps, Cars, Buses..."
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <button className="btn-sg-main" type="submit">+ Add Category</button>
      </form>
      {err && <div className="text-danger mb-3" style={{ fontSize: '.8rem' }}>{err}</div>}

      {categories.length === 0 ? (
        <div className="empty-sg">No categories yet. Add your first one above (e.g. Maps, Cars, Buses).</div>
      ) : (
        <div className="table-responsive">
          <table className="table-sg">
            <thead><tr><th>Category</th><th>Mods</th><th></th></tr></thead>
            <tbody>
              {categories.map(c => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{countFor(c.name)}</td>
                  <td><button className="btn-sg-danger" onClick={() => deleteCategory(c.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default function AdminDashboard() {
  const { mods, addMod, deleteMod, updateMod, categories, addCategory, deleteCategory } = useAuth()
  const [tab, setTab] = useState('upload')

  return (
    <div>
      <Navbar />
      <div className="container py-4">
        <div className="d-flex gap-2 mb-4 flex-wrap">
          <div className={`tab ${tab === 'upload' ? 'active' : ''}`} onClick={() => setTab('upload')}>Upload</div>
          <div className={`tab ${tab === 'manage' ? 'active' : ''}`} onClick={() => setTab('manage')}>Manage</div>
          <div className={`tab ${tab === 'categories' ? 'active' : ''}`} onClick={() => setTab('categories')}>Categories</div>
        </div>
        {tab === 'upload' && <UploadForm addMod={addMod} categories={categories} />}
        {tab === 'manage' && <ManageList mods={mods} deleteMod={deleteMod} updateMod={updateMod} categories={categories} />}
        {tab === 'categories' && (
          <CategoryManager categories={categories} addCategory={addCategory} deleteCategory={deleteCategory} mods={mods} />
        )}
      </div>
    </div>
  )
}