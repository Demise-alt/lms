import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api } from '@/services/api'

export interface User {
  id: string
  email: string
  full_name: string
  is_active: boolean
  roles: string[]
}

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  setAuth: (user: User, accessToken: string, refreshToken?: string) => void
  setAccessToken: (token: string) => void
  logout: () => void
  login: (email: string, password: string) => Promise<void>
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: true,

      setAuth: (user, accessToken, refreshToken) => {
        set({ user, accessToken, refreshToken, isAuthenticated: true, isLoading: false })
      },

      setAccessToken: (token) => {
        set({ accessToken: token })
      },

      logout: () => {
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false })
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          const response = await api.post('/auth/login', { email, password })
          const { access_token, refresh_token } = response.data.data
          const userResponse = await api.get('/auth/me')
          const user = userResponse.data.data
          get().setAuth(user, access_token, refresh_token)
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      checkAuth: async () => {
        const token = get().accessToken
        if (!token) {
          set({ isLoading: false })
          return
        }

        try {
          const response = await api.get('/auth/me')
          const user = response.data.data
          set({ user, isAuthenticated: true, isLoading: false })
        } catch (error) {
          get().logout()
          set({ isLoading: false })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)