import { ref, onMounted } from "vue";

export function useStatsAnimation() {
  const isAnimating = ref(false);
  const hasAnimated = ref(false);

  // Animate a single stat number
  const animateStat = (
    element: HTMLElement,
    targetValue: number,
    duration: number = 1500,
    isYearsOfExperience: boolean = false
  ) => {
    let currentValue = 0;
    const frameDuration = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameDuration);
    const increment = targetValue / totalFrames;

    let currentFrame = 0;
    let animationValue = 0;

    const counterAnimation = setInterval(() => {
      currentFrame++;
      animationValue += increment;

      if (currentFrame === totalFrames) {
        clearInterval(counterAnimation);
        element.textContent = isYearsOfExperience
          ? `${targetValue}+`
          : targetValue.toString();
      } else {
        element.textContent = Math.floor(animationValue).toString();
      }
    }, frameDuration);
  };

  // Animate all stats
  const animateStats = () => {
    if (hasAnimated.value) return;

    isAnimating.value = true;

    const statElements = document.querySelectorAll(".stat-number");

    statElements.forEach((element) => {
      const htmlElement = element as HTMLElement;
      const targetValue = parseInt(
        htmlElement.getAttribute("data-count") || "0"
      );
      const isYearsOfExperience = htmlElement.id === "years-of-experience";

      // Reset to zero before animation
      htmlElement.textContent = "0";

      // Start animation
      animateStat(htmlElement, targetValue, 1500, isYearsOfExperience);
    });

    hasAnimated.value = true;

    // Reset animation state after completion
    setTimeout(() => {
      isAnimating.value = false;
    }, 1500);
  };

  // Reset animation state (useful for re-triggering)
  const resetAnimation = () => {
    hasAnimated.value = false;
    isAnimating.value = false;
  };

  // Setup intersection observer for auto-triggering
  const setupIntersectionObserver = (
    targetSelector: string = ".stats-container"
  ) => {
    onMounted(() => {
      const target = document.querySelector(targetSelector);
      if (!target) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasAnimated.value) {
              animateStats();
            }
          });
        },
        {
          threshold: 0.5,
          rootMargin: "0px 0px -50px 0px",
        }
      );

      observer.observe(target);
    });
  };

  return {
    isAnimating,
    hasAnimated,
    animateStats,
    resetAnimation,
    setupIntersectionObserver,
  };
}
