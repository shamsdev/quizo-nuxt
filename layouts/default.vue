<template>
  <div class="app-background">
    <div class="app-wrapper">
      <NuxtPage/>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.app-background {
  height: 100vh;
  height: 100dvh;
  min-height: 100vh;
  min-height: 100dvh;
  background: linear-gradient(160deg, var(--bg-outer) 0%, var(--bg-outer-end) 100%);
  background-attachment: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  padding-top: max(var(--space-4), env(safe-area-inset-top));
  padding-right: max(var(--space-4), env(safe-area-inset-right));
  padding-bottom: max(var(--space-4), env(safe-area-inset-bottom));
  padding-left: max(var(--space-4), env(safe-area-inset-left));
  position: relative;
  box-sizing: border-box;
}

.app-background::before {
  content: '';
  position: fixed;
  inset: 0;
  background: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(14, 165, 233, 0.18), transparent),
              radial-gradient(ellipse 60% 40% at 100% 100%, rgba(139, 92, 246, 0.12), transparent);
  pointer-events: none;
  z-index: 0;
}

.app-wrapper {
  padding: var(--space-4);
  max-width: 480px;
  width: 100%;
  height: 100%;
  min-height: 0;
  max-height: 100vh;
  max-height: 100dvh;
  margin: 0 auto;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, var(--bg-inner) 0%, var(--bg-inner-end) 100%);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-lg), 0 0 0 1px rgba(255, 255, 255, 0.06);
  position: relative;
  z-index: 1;
}

.app-wrapper > * {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.app-wrapper::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(145deg, rgba(14, 165, 233, 0.2), transparent 45%, transparent 55%, rgba(139, 92, 246, 0.15));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}
</style>
