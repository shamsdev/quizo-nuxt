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
      title: 'خطای اتصال',
      message: 'ارتباط شما با سرور بازی برقرار نشد. از اتصال به اینترنت مطمئن شوید و دوباره امتحان کنید.',
      buttons: [
        {
          text: 'تلاش مجدد',
          color: 'error',
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

  const serverEndpoint = useRuntimeConfig().public.serverEndpoint ?? 'https://quizo.shamsdev.com/Hub';
  await $karizmaConnection.connection.connect(serverEndpoint);

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
  height: 100%;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: var(--space-6);
}

.logo-anim-wrapper {
  width: 200px;
}

.logo-anim-wrapper h1 {
  margin-top: calc(-1 * var(--space-5));
  text-align: center;
  font-size: var(--text-4xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.logo-anim {
  width: 100%;
  max-width: 100%;
  height: 150px;
}

.progress-bar-wrapper {
  margin-top: var(--space-16);
  width: 85%;
  max-width: 280px;
  height: 12px;
  background: var(--bg-elevated);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-bottom: var(--space-5);
  border: 1px solid var(--border-subtle);
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-orange-light));
  border-radius: var(--radius-full);
  transition: width 0.15s ease-out;
  box-shadow: var(--shadow-glow-gold);
}

.loading-label {
  font-size: var(--text-base);
  font-weight: var(--font-weight-medium);
  color: var(--text-muted);
  direction: rtl;
}
</style>
