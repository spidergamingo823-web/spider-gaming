import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

function useLocalState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : initial
    } catch {
      return initial
    }
  })
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
  }, [key, value])
  return [value, setValue]
}

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalState('sg_current_user', null)
  const [users, setUsers] = useLocalState('sg_users', [])
  const [mods, setMods] = useLocalState('sg_mods', [])
  const [categories, setCategories] = useLocalState('sg_categories', [])

  // Normal users only -- no role picker at signup
  const signup = (username, password) => {
    if (!username || !password) return { ok: false, error: 'Fill all fields' }
    if (users.find(u => u.username === username)) return { ok: false, error: 'Username already taken' }
    const newUser = { username, password, role: 'user' }
    setUsers([...users, newUser])
    setUser({ username, role: 'user' })
    return { ok: true }
  }

  const login = (username, password) => {
    const found = users.find(u => u.username === username && u.password === password)
    if (!found) return { ok: false, error: 'Invalid username or password' }
    setUser({ username: found.username, role: found.role })
    return { ok: true }
  }

  // Admin has its own fixed, separate login -- not selectable at signup
  const adminLogin = (username, password) => {
    if (username === 'admin' && password === 'admin123') {
      setUser({ username: 'admin', role: 'admin' })
      return { ok: true }
    }
    return { ok: false, error: 'Invalid admin credentials' }
  }

  const logout = () => setUser(null)

  const addMod = (mod) => setMods([...mods, mod])
  const deleteMod = (id) => setMods(mods.filter(m => m.id !== id))
  const updateMod = (id, updates) => setMods(mods.map(m => m.id === id ? { ...m, ...updates } : m))

  const addCategory = (name) => {
    if (!name || !name.trim()) return { ok: false, error: 'Category name required' }
    if (categories.find(c => c.name.toLowerCase() === name.trim().toLowerCase())) {
      return { ok: false, error: 'Category already exists' }
    }
    setCategories([...categories, { id: Date.now(), name: name.trim() }])
    return { ok: true }
  }
  const deleteCategory = (id) => setCategories(categories.filter(c => c.id !== id))

  return (
    <AuthContext.Provider value={{
      user, signup, login, adminLogin, logout,
      mods, addMod, deleteMod, updateMod,
      categories, addCategory, deleteCategory
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
