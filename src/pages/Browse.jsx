import React, { useMemo, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import ModCard from '../components/ModCard.jsx'
import ModModal from '../components/ModModal.jsx'
import { useAuth } from '../context/AuthContext.jsx'

function CategoryCard({ name, count, onClick }) {
  return (
    <div className="mcard" onClick={onClick} style={{ textAlign: 'center', padding: '30px 10px' }}>
      <div style={{ fontSize: '2.2rem' }}>📁</div>
      <div className="body" style={{ padding: '10px 14px' }}>
        <h3 className="h6 mb-1">{name}</h3>
        <div className="meta">{count} mod{count === 1 ? '' : 's'}</div>
      </div>
    </div>
  )
}

export default function Browse() {
  const { mods, categories } = useAuth()
  const [activeCategory, setActiveCategory] = useState(null)
  const [versionFilter, setVersionFilter] = useState('all')
  const [selected, setSelected] = useState(null)

  const modsInCategory = useMemo(
    () => mods.filter(m => m.category === activeCategory),
    [mods, activeCategory]
  )

  const versions = useMemo(
    () => Array.from(new Set(modsInCategory.map(m => m.version))).sort(),
    [modsInCategory]
  )

  const visibleMods = useMemo(() => {
    const list = versionFilter === 'all'
      ? modsInCategory
      : modsInCategory.filter(m => m.version === versionFilter)
    return [...list].reverse()
  }, [modsInCategory, versionFilter])

  const openCategory = (name) => {
    setActiveCategory(name)
    setVersionFilter('all')
  }

  const backToCategories = () => {
    setActiveCategory(null)
    setVersionFilter('all')
  }

  return (
    <div>
      <Navbar />
      <div className="container py-4">
        {!activeCategory ? (
          <>
            <h3 className="mb-4">Browse by Category</h3>
            {categories.length === 0 ? (
              <div className="empty-sg">No categories available yet. Check back soon!</div>
            ) : (
              <div className="grid-sg">
                {categories.map(c => (
                  <CategoryCard
                    key={c.id}
                    name={c.name}
                    count={mods.filter(m => m.category === c.name).length}
                    onClick={() => openCategory(c.name)}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
              <div>
                <button className="btn-sg-ghost mb-2" onClick={backToCategories}>← All Categories</button>
                <h3 className="mb-0">{activeCategory}</h3>
              </div>
              {versions.length > 0 && (
                <div>
                  <label className="sg-label mb-1">Filter by version</label>
                  <select className="form-control-sg" value={versionFilter} onChange={e => setVersionFilter(e.target.value)}>
                    <option value="all">All versions</option>
                    {versions.map(v => <option key={v} value={v}>v{v}</option>)}
                  </select>
                </div>
              )}
            </div>

            {visibleMods.length === 0 ? (
              <div className="empty-sg">No mods found for this selection.</div>
            ) : (
              <div className="grid-sg">
                {visibleMods.map(m => (
                  <ModCard key={m.id} mod={m} onClick={() => setSelected(m)} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
      {selected && <ModModal mod={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
