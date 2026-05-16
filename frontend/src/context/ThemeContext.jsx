import { createContext, useContext, useEffect, useState } from "react"

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("tema") === "oscuro"
  )

  useEffect(() => {
    const html = document.documentElement
    if (darkMode) {
      html.classList.add("dark")
      localStorage.setItem("tema", "oscuro")
    } else {
      html.classList.remove("dark")
      localStorage.setItem("tema", "claro")
    }
  }, [darkMode])

  const toggleDarkMode = () => setDarkMode(!darkMode)

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}