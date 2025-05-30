// src/composables/useBackCancel.ts
import { onMounted, onUnmounted, watch } from 'vue'

/**
 * @param isActive  a ref<boolean> that indicates whether multi-select (or any “mode”) is active
 * @param disable   a callback that disables your mode (e.g. sets isActive.value = false)
 */
export function useBackCancel(
  isActive: { value: boolean },
  disable: () => void
) {
  const onPopState = () => {
    if (isActive.value) {
      // 1) cancel the mode
      disable()
      // 2) re-push state so user stays on this page
      history.pushState(null, '', window.location.href)
    }
    // else: do nothing and let the back navigation happen
  }

  onMounted(() => {
    // always listen
    window.addEventListener('popstate', onPopState)
    // if already active on mount, seed one history entry
    if (isActive.value) {
      history.pushState(null, '', window.location.href)
    }
  })

  onUnmounted(() => {
    window.removeEventListener('popstate', onPopState)
  })

  // whenever the mode turns on, push a dummy state
  watch(
    () => isActive.value,
    (newVal) => {
      if (newVal) {
        history.pushState(null, '', window.location.href)
      }
    }
  )
}
