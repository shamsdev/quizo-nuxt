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
  padding: 16px 0;
  font-size: 14px;
  color: #666;
  background-color: transparent;
  position: absolute;
  bottom: 0;
  left: 0;
}

.heart {
  margin: 0 4px;
  color: #e25555;
}

.link {
  color: #3498db;
  text-decoration: none;
  font-weight: 600;
}

.link:hover {
  text-decoration: underline;
}
</style>
<script setup lang="ts">
</script>