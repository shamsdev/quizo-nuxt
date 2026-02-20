<template>
  <div class="match-result-dialog">
    <p v-if="oppLeft" class="opp-left-title">حریف بازی را ترک کرد!</p>
    <p class="result-title">{{ resultText }}</p>
    <p class="score-text">امتیاز شما: {{ score }}</p>
    <FancyButton class="btn-home" title="بازگشت به خانه" @click="goHome"/>
  </div>
</template>

<script setup>
import {computed} from 'vue';
import {useRouter} from 'vue-router';
import FancyButton from './FancyButton.vue';
import {launchConfetti} from "~/utils/confetti.js";

const props = defineProps({
  result: {
    type: String,
    required: true,
    validator: (value) => ['Win', 'Lose', 'Draw'].includes(value),
  },
  score: {
    type: Number,
    required: true,
  },
  oppLeft: {
    type: Boolean,
    required: true,
  },
});

const router = useRouter();

const resultText = computed(() => {
  if (props.result === 'Win') {
    launchConfetti();
    return 'برنده شدی!';
  }
  if (props.result === 'Lose') {
    return 'باختی!';
  }
  return 'تساوی!';
});

const goHome = () => {
  router.replace('/home');
};
</script>

<style scoped>
.match-result-dialog {
  direction: rtl;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-6);
  gap: var(--space-4);
}

.opp-left-title {
  font-size: var(--text-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--text-muted);
  margin: 0 0 var(--space-2);
}

.result-title {
  font-size: var(--text-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin: 0;
}

.score-text {
  font-size: var(--text-xl);
  color: var(--text-secondary);
  margin: 0;
}

.btn-home {
  margin-top: var(--space-4);
}
</style>
