<template>
  <div class="app-background">
    <div class="app-wrapper">
      <NuxtPage/>
    </div>
  </div>
</template>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

.app-wrapper {
  padding: 16px;
  max-width: 480px;
  width: 100%;
  margin: 0 auto;
  height: 100vh;
  background: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.app-background {
  min-height: 100vh;
  background: #f0f0f0; /* or an image */
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>
