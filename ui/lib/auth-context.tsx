"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type UserRole = "manager" | "employee" | "client"

interface User {
  id: string
  email: string
  name: string
  role: UserRole
}

interface StoredUser extends User {
  password: string
  department?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (
    email: string,
    password: string,
    role: UserRole,
    department?: string
  ) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/* ===== MOCK USERS ===== */
const MOCK_USERS: StoredUser[] = [
  {
    id: "1",
    email: "manager@company.com",
    password: "manager123",
    name: "John Manager",
    role: "manager",
  },
  {
    id: "2",
    email: "employee@company.com",
    password: "employee123",
    name: "Sarah Employee",
    role: "employee",
  },
  {
    id: "3",
    email: "client@company.com",
    password: "client123",
    name: "Mike Client",
    role: "client",
  },
]

const REGISTERED_USERS_KEY = "registeredUsers"

/* ===== HELPERS ===== */
function loadRegisteredUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function saveRegisteredUsers(users: StoredUser[]) {
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users))
}

/* ===== PROVIDER ===== */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem("user")
      return stored ? (JSON.parse(stored) as User) : null
    } catch {
      return null
    }
  })

  const [isLoading] = useState(false)

  /* ===== LOGIN (EMAIL + PASSWORD ONLY) ===== */
  const login = async (email: string, password: string): Promise<boolean> => {
    const registeredUsers = loadRegisteredUsers()

    const foundUser = [...MOCK_USERS, ...registeredUsers].find(
      (u) => u.email === email && u.password === password
    )

    if (!foundUser) return false

    const { password: _, ...safeUser } = foundUser
    setUser(safeUser)
    localStorage.setItem("user", JSON.stringify(safeUser))
    return true
  }

  /* ===== REGISTER ===== */
  const register = async (
    email: string,
    password: string,
    role: UserRole,
    department?: string
  ) => {
    const normalizedEmail = email.trim().toLowerCase()
    const registeredUsers = loadRegisteredUsers()

    const exists =
      MOCK_USERS.some((u) => u.email === normalizedEmail) ||
      registeredUsers.some((u) => u.email === normalizedEmail)

    if (exists) {
      return { success: false, error: "Энэ имэйл бүртгэлтэй байна." }
    }

    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      email: normalizedEmail,
      password,
      name: normalizedEmail.split("@")[0],
      role,
      department,
    }

    saveRegisteredUsers([newUser, ...registeredUsers])
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  )
}

/* ===== HOOK ===== */
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
