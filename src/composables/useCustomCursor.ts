import { onMounted, onUnmounted } from "vue";

export function useCustomCursor() {
  let cursor: HTMLElement | null = null;
  let isDesktop = false;

  // Create cursor element
  const createCursor = () => {
    cursor = document.createElement("div");
    cursor.className = "custom-cursor";
    cursor.style.cssText = `
      width: 20px;
      height: 20px;
      border: 2px solid var(--primary, #197278);
      border-radius: 50%;
      position: fixed;
      pointer-events: none;
      transform: translate(-50%, -50%);
      z-index: 9999;
      transition: transform 0.1s ease;
      display: none;
    `;
    document.body.appendChild(cursor);
  };

  // Handle mouse movement
  const handleMouseMove = (e: MouseEvent) => {
    if (!cursor) return;

    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
    cursor.style.display = "block";
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    if (!cursor) return;
    cursor.style.display = "none";
  };

  // Handle hover on interactive elements
  const handleElementHover = (element: Element) => {
    if (!cursor) return;

    element.addEventListener("mouseover", () => {
      if (cursor) {
        cursor.style.transform = "translate(-50%, -50%) scale(1.5)";
        cursor.style.borderColor = "transparent";
        cursor.style.backgroundColor = "rgba(25, 114, 120, 0.2)";
      }
    });

    element.addEventListener("mouseout", () => {
      if (cursor) {
        cursor.style.transform = "translate(-50%, -50%) scale(1)";
        cursor.style.borderColor = "var(--primary, #197278)";
        cursor.style.backgroundColor = "transparent";
      }
    });
  };

  // Initialize cursor
  const initializeCursor = () => {
    // Only enable on desktop
    isDesktop = window.innerWidth > 1024;

    if (!isDesktop) return;

    createCursor();

    // Add event listeners
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll(
      'a, button, [role="button"]'
    );
    interactiveElements.forEach(handleElementHover);
  };

  // Clean up cursor
  const destroyCursor = () => {
    if (cursor) {
      document.body.removeChild(cursor);
      cursor = null;
    }

    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseleave", handleMouseLeave);
  };

  // Handle window resize
  const handleResize = () => {
    const newIsDesktop = window.innerWidth > 1024;

    if (newIsDesktop && !isDesktop) {
      // Switched to desktop
      isDesktop = true;
      initializeCursor();
    } else if (!newIsDesktop && isDesktop) {
      // Switched to mobile
      isDesktop = false;
      destroyCursor();
    }
  };

  // Update interactive elements (useful when DOM changes)
  const updateInteractiveElements = () => {
    if (!isDesktop) return;

    const interactiveElements = document.querySelectorAll(
      'a, button, [role="button"]'
    );
    interactiveElements.forEach(handleElementHover);
  };

  onMounted(() => {
    initializeCursor();
    window.addEventListener("resize", handleResize);
  });

  onUnmounted(() => {
    destroyCursor();
    window.removeEventListener("resize", handleResize);
  });

  return {
    updateInteractiveElements,
    isDesktop: () => isDesktop,
  };
}
