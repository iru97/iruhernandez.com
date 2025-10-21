import { ref, onMounted, watch } from "vue";

export function useTheme() {
  const isDarkMode = ref(false);
  const isInitialized = ref(false);

  // Check if user prefers dark mode
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

  // Initialize theme based on user preference or saved preference
  const initializeTheme = () => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark" || (!savedTheme && prefersDarkScheme.matches)) {
      isDarkMode.value = true;
      document.body.classList.add("dark-theme");
    } else {
      isDarkMode.value = false;
      document.body.classList.remove("dark-theme");
    }

    isInitialized.value = true;
  };

  // Toggle theme
  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value;

    if (isDarkMode.value) {
      document.body.classList.add("dark-theme");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-theme");
      localStorage.setItem("theme", "light");
    }
  };

  // Watch for system theme changes
  const handleSystemThemeChange = (e: MediaQueryListEvent) => {
    if (!localStorage.getItem("theme")) {
      isDarkMode.value = e.matches;
      if (e.matches) {
        document.body.classList.add("dark-theme");
      } else {
        document.body.classList.remove("dark-theme");
      }
    }
  };

  onMounted(() => {
    initializeTheme();
    prefersDarkScheme.addEventListener("change", handleSystemThemeChange);
  });

  // Watch for changes to apply theme
  watch(isDarkMode, (newValue) => {
    if (isInitialized.value) {
      if (newValue) {
        document.body.classList.add("dark-theme");
      } else {
        document.body.classList.remove("dark-theme");
      }
    }
  });

  return {
    isDarkMode,
    toggleTheme,
    isInitialized,
  };
}
