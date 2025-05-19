import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    // Check for saved theme in localStorage or use system preference
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const initialTheme = savedTheme || systemTheme;
    
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark-theme", initialTheme === "dark");
    document.documentElement.classList.toggle("light-theme", initialTheme === "light");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    
    // Update localStorage
    localStorage.setItem("theme", newTheme);
    
    // Update DOM
    document.documentElement.classList.toggle("dark-theme", newTheme === "dark");
    document.documentElement.classList.toggle("light-theme", newTheme === "light");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
    >
      <Sun className={`h-6 w-6 absolute transition-opacity ${theme === 'dark' ? 'opacity-0' : 'opacity-100'}`} />
      <Moon className={`h-6 w-6 transition-opacity ${theme === 'dark' ? 'opacity-100' : 'opacity-0'}`} />
    </Button>
  );
}