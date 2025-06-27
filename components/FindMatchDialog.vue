<template>
  <div class="find-match-dialog">
    <div class="find-match-label">{{ titleLabel }}</div>
    <!-- Opponent Avatar -->
    <transition name="fade">
      <div class="avatar-section">
        <UserAvatar
            :username="opponent.displayName"
            :avatarId="opponent.avatarId"
            :color="'#ff793f'"
        />
      </div>
    </transition>

    <!-- VS Label -->
    <div class="vs-label">━ VS ━</div>

    <!-- Current User Avatar -->
    <div class="avatar-section">
      <UserAvatar
          :username="currentUser.displayName"
          :avatarId="currentUser.avatarId"/>
    </div>

    <!-- Cancel Button -->
    <FancyButton
        :title="cancelButtonAttribute.label"
        :onClick="cancelMatch"
        :color="cancelButtonAttribute.color"
        :disabled="!canCancel"
    />
  </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted} from 'vue'
import UserAvatar from './UserAvatar.vue'
import FancyButton from './FancyButton.vue'
import {TOTAL_AVATARS_COUNT} from "~/constants/settings.js";
import {userDataStore} from "~/stores/user-data.store.js";

const emit = defineEmits(['close'])

const currentUser = ref({
  displayName: 'You',
  avatarId: 1,
})

// Opponent simulation
const opponent = ref({
  displayName: 'Finding...',
  avatarId: getRandomAvatar(),
})

const cancelButtonAttributes = {
  preStart: {
    label: 'Waiting ...',
    color: '#118194'
  },
  findingMatch: {
    label: 'Cancel find match',
    color: '#d3593e'
  },
  startingMatch: {
    label: 'Match is starting ...',
    color: '#118194'
  },
}

let avatarShufflingInterval = null;
let activeCancelButtonInterval = null;

const titleLabel = ref('Finding Match ...');

const canCancel = ref(false);
const cancelButtonAttribute = ref(cancelButtonAttributes.preStart);

function getRandomAvatar() {
  return Math.floor(Math.random() * TOTAL_AVATARS_COUNT) + 1;
}

function startAvatarShuffling() {
  avatarShufflingInterval = setInterval(() => {
    opponent.value.avatarId = getRandomAvatar()
  }, 300)
}

// Simulate finding a match after a few seconds
function simulateMatchFound() {
  setTimeout(() => {
    onMatchFound({
      name: 'Opponent',
      avatarId: getRandomAvatar(),
    });
  }, 4000)
}

function activeCancelButton() {
  // Activate cancel button after 2s
  activeCancelButtonInterval = setTimeout(() => {
    cancelButtonAttribute.value = cancelButtonAttributes.findingMatch;
    canCancel.value = true;
  }, 2000);
}

function onMatchFound(foundOpponent) {
  clearIntervals();

  opponent.value = foundOpponent;

  titleLabel.value = 'Opponent found'
  cancelButtonAttribute.value = cancelButtonAttributes.startingMatch;
  canCancel.value = false;
}

function cancelMatch() {
  emit('close');
}

onMounted(() => {
  startAvatarShuffling();
  activeCancelButton();
  updateUserAvatar();
  simulateMatchFound();
})

function updateUserAvatar() {
  const userData = userDataStore();
  currentUser.value.displayName = userData.displayName;
  currentUser.value.avatarId = userData.avatarId;
}

function clearIntervals() {
  clearInterval(avatarShufflingInterval);
  clearInterval(activeCancelButtonInterval);
}

onUnmounted(() => {
  clearIntervals();
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

.find-match-label {
  font-size: 18px;
  font-weight: bold;
  color: #555;
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