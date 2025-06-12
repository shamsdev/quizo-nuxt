<template>
  <div class="find-match-dialog">
    <!-- Current User Avatar -->
    <div class="avatar-section">
      <UserAvatar :username="currentUser.name" :avatarId="currentUser.avatarId"/>
    </div>

    <!-- VS Label -->
    <div class="vs-label">VS</div>

    <!-- Opponent Avatar -->
    <transition name="fade">
      <div class="avatar-section">
        <UserAvatar :username="opponent.name" :avatarId="opponent.avatarId"/>
      </div>
    </transition>

    <!-- Cancel Button -->
    <FancyButton
        title="Cancel Find Match"
        :onClick="cancelMatch"
        :color="'#e74c3c'"
        :disabled="!canCancel"
    />
  </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted} from 'vue'
import UserAvatar from './UserAvatar.vue'
import FancyButton from './FancyButton.vue'
import {TOTAL_AVATARS_COUNT} from "~/constants/settings.js";

const emit = defineEmits(['close'])

const currentUser = {
  name: 'You',
  avatarId: 1,
}

// Opponent simulation
const opponent = ref({
  name: 'Finding...',
  avatarId: getRandomAvatar(),
})

let intervalId = null;
const canCancel = ref(false);

function getRandomAvatar() {
  return Math.floor(Math.random() * TOTAL_AVATARS_COUNT) + 1;
}

function startAvatarShuffling() {
  intervalId = setInterval(() => {
    opponent.value.avatarId = getRandomAvatar()
  }, 500)
}

// Simulate finding a match after a few seconds
function simulateMatchFound() {
  setTimeout(() => {
    clearInterval(intervalId)
    opponent.value = {
      name: 'Opponent',
      avatarId: getRandomAvatar(),
    }
  }, 4000)

  // Activate cancel button after 5s
  setTimeout(() => {
    canCancel.value = true
  }, 2000)
}

function cancelMatch() {
  emit('close');
}

onMounted(() => {
  startAvatarShuffling()
  simulateMatchFound()
})

onUnmounted(() => {
  clearInterval(intervalId)
})
</script>

<style scoped>
.find-match-dialog {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 24px;
  max-height: 90vh;
  overflow: hidden;
}

.avatar-section {
  display: flex;
  justify-content: center;
  width: 100%;
}

.vs-label {
  font-size: 24px;
  font-weight: bold;
  color: #555;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>