"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { api } from "@/services/api"

interface User {
  id: string
  email: string
  full_name: string
  roles: string[]
  avatar?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem("eltms_token")
    const storedUser = localStorage.getItem("eltms_user")

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
      api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { email, password })
      const { access_token, user: userData } = response.data

      localStorage.setItem("eltms_token", access_token)
      localStorage.setItem("eltms_user", JSON.stringify(userData))

      setToken(access_token)
      setUser(userData)
      api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("eltms_token")
    localStorage.removeItem("eltms_user")
    setToken(null)
    setUser(null)
    delete api.defaults.headers.common["Authorization"]
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
