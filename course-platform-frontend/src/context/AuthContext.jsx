import { createContext, useContext, useState, useEffect } from 'react'
import axiosInstance from '../api/axiosInstance'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      const parsed = JSON.parse(stored)
      setUser(parsed)
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`
    }
    setLoading(false)
  }, [])

  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData))
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('user')
    delete axiosInstance.defaults.headers.common['Authorization']
    setUser(null)
  }

  const isAdmin = () => user?.roles?.includes('ROLE_ADMIN')
  const isTrainer = () => user?.roles?.includes('ROLE_TRAINER')
  const isUser = () => user?.roles?.includes('ROLE_USER')

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAdmin, isTrainer, isUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
