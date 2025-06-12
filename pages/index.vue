<template>
  <div class="loading-screen">
    <div class="progress-bar-wrapper">
      <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
    </div>
    <p class="loading-label">{{ loadingText }}</p>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {useRouter} from 'vue-router'

const progress = ref(0)
const loadingText = ref('Loading...')

const router = useRouter()

onMounted(() => {
  const interval = setInterval(() => {
    if (progress.value < 100) {
      progress.value += 5
      if (progress.value < 30) loadingText.value = 'Loading assets...'
      else if (progress.value < 60) loadingText.value = 'Connecting to server...'
      else if (progress.value < 90) loadingText.value = 'Preparing experience...'
      else loadingText.value = 'Almost done...'
    } else {
      clearInterval(interval)
      router.push('/home')
    }
  }, 100) // total time = 100 * 20 = 2 seconds
})
</script>

<style scoped>
.loading-screen {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.progress-bar-wrapper {
  width: 80%;
  height: 10px;
  background: rgba(68, 65, 65, 0.82);
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 20px;
}

.progress-bar {
  height: 100%;
  background: #4caf50;
  transition: width 0.1s linear;
}

.loading-label {
  font-size: 18px;
  font-weight: 500;
}
</style>
