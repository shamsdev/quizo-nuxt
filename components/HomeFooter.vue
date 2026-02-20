<template>
  <footer class="home-footer">
    <a href="https://shamsdev.com" target="_blank" rel="noopener" class="link">
      ShamsDev.com
    </a>
    ساخته شده با
    <span class="heart">❤️</span>
    توسط
  </footer>
</template>

<style scoped>
.home-footer {
  width: 100%;
  text-align: center;
  padding: var(--space-4) 0;
  padding-bottom: max(var(--space-4), env(safe-area-inset-bottom));
  font-size: var(--text-sm);
  color: var(--text-muted);
  background-color: transparent;
  flex-shrink: 0;
}

.heart {
  margin: 0 var(--space-1);
  color: var(--color-error);
}

.link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: var(--font-weight-semibold);
}

.link:hover {
  text-decoration: underline;
}
</style>
<script setup lang="ts">
</script>