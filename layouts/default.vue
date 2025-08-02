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
.app-wrapper {
  padding: 16px;
  max-width: 480px;
  width: 100%;
  margin: 0 auto;
  height: 100vh;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  background-color: #94e2ff;
  background-image: url('@/assets/images/bg-pattern.png');
  background-repeat: repeat;
  background-size: 300px auto;
  background-position: top left;
  animation: animated-bg 20s linear infinite;
}

@keyframes animated-bg {
  from {
    background-position: 0 0;
  }
  to {
    background-position: 300px 300px;
  }
}

.app-background {
  min-height: 100vh;
  background: #3c3c3c; /* or an image */
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>
