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
const {$karizmaConnection} = useNuxtApp();

onMounted(async () => {
  await connectToServer();
  await getLoginData();
})

async function connectToServer() {
  updateProgress('Connecting to server...', 0);
  await $karizmaConnection.connection.connect('http://localhost:4001/Hub');
  updateProgress('Connection to server established...', 30);
}

async function getLoginData() {
  updateProgress('Getting login data...');
  const loginData = await $karizmaConnection.connection.request('/test/get-test');
  console.warn(loginData);
  updateProgress('Login data received', 100);
  setTimeout(() => {
    router.replace('/home');
  }, 500);
}


function updateProgress(status, progressValue) {
  if (progressValue)
    progress.value = progressValue;

  loadingText.value = status;
}

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
