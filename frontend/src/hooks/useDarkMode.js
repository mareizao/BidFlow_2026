import { useEffect, useState } from "react"

export function useDarkMode() {
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

  return { darkMode, toggleDarkMode }
}