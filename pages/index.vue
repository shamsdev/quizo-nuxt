<template>
  <div class="loading-screen">
    <div class="logo-anim-wrapper">
      <LottiePlayer class="logo-anim" :animationData="quizLogoAnimation" :loop="false" :autoplay="true"/>
      <h1>Quizo!</h1>
    </div>
    <div class="progress-bar-wrapper">
      <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
    </div>
    <p class="loading-label">{{ loadingText }}</p>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import {userStore} from "~/stores/user.store";

const progress = ref(0)
const loadingText = ref('صبر کنید ...')

const router = useRouter()
const {$karizmaConnection} = useNuxtApp();

import quizLogoAnimation from '~/assets/animations/purple-questions.json';

onMounted(async () => {
  try {

    await connectToServer();
    const hasToken = StorageWrapper.has(StorageKeys.AccessToken);
    if (!hasToken)
      await requestSignUp();
    await requestSignIn();

  } catch (ex) {
    console.error(ex);
    useMessageDialog.show({
      title: 'Connection Error',
      message: 'Cannot connect to game servers. Please check your internet connection and try again.',
      buttons: [
        {
          text: 'Retry',
          color: '#e74c3c',
          onClick: () => window.location.reload()
        }
      ]
    });
  }
})

async function connectToServer() {
  updateProgress('در حال اتصال ...', 0);

  $karizmaConnection.unregisterCallbacks();

  if ($karizmaConnection.connection.isConnected)
    await $karizmaConnection.connection.disconnect();

  $karizmaConnection.registerCallbacks();

  await $karizmaConnection.connection.connect('http://localhost:4001/Hub'); //TODO add to env

  if (!$karizmaConnection.connection.isConnected)
    throw new Error('Connection error');

  updateProgress('متصل شد!', 30);
}

async function requestSignUp() {
  updateProgress('در حال ثبت نام ...');

  const signUpResult = await $karizmaConnection.connection.request('user/sign-up');

  if (signUpResult.HasError)
    throw new Error('Error signing up: ' + signUpResult.Error);

  if (!signUpResult.Result.AccessToken)
    throw new Error('access token is null: ' + JSON.stringify(signUpResult.Result));

  StorageWrapper.set(StorageKeys.AccessToken, signUpResult.Result.AccessToken);

  updateProgress('ثبت نام انجام شد!', 60);
}


async function requestSignIn() {
  updateProgress('در حال ورود ...');

  const accessToken = StorageWrapper.get(StorageKeys.AccessToken, null);

  if (!accessToken)
    throw new Error('null access token in sign-in phase');

  const signInResult = await $karizmaConnection.connection.request('user/sign-in',
      {AccessToken: accessToken});

  if (signInResult.HasError)
    throw new Error('Error signing in: ' + JSON.stringify(signInResult.Error));

  if (!signInResult.Result)
    throw new Error('signInResult is null');

  const userData = userStore();
  userData.setData(signInResult.Result.UserData);
  updateProgress('وارد شدید!', 100);

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

.logo-anim-wrapper {
  width: 200px;
}

.logo-anim-wrapper h1 {
  margin-top: -20px;
  text-align: center;
}

.logo-anim {
  width: 100%;
  max-width: 100%;
  height: 150px;
}

.progress-bar-wrapper {
  margin-top: 100px;

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
  direction: rtl;
}
</style>
