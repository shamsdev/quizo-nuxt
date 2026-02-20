<template>
  <div class="find-match-dialog">
    <div class="find-match-label">{{ titleLabel }}</div>
    <!-- Opponent Avatar -->
    <transition name="fade">
      <div class="avatar-section">
        <UserAvatar
            :user-id="opponent.userId"
            :username="opponent.displayName"
            :avatar-id="opponent.avatarId"
            loading-strategy="eager"
        />
      </div>
    </transition>

    <!-- VS Label -->
    <div class="vs-label">━ VS ━</div>

    <!-- Current User Avatar -->
    <div class="avatar-section">
      <UserAvatar
          :user-id="currentUser.userId"
          :username="currentUser.displayName"
          :avatar-id="currentUser.avatarId"
          loading-strategy="eager"
        />
    </div>

    <!-- Cancel Button -->
    <FancyButton
        :title="cancelButtonAttribute.label"
        :onClick="requestLeaveMatchMake"
        :color="cancelButtonAttribute.color"
        :disabled="!canCancel"
    />
  </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted} from 'vue'
import UserAvatar from './UserAvatar.vue'
import FancyButton from './FancyButton.vue'
import { SEARCHING_AVATAR_IDS } from '~/constants/settings.js'
import {userStore} from "~/stores/user.store";
import {gameStore} from "~/stores/game.store";

const emit = defineEmits(['close'])
const {$karizmaConnection} = useNuxtApp();
const router = useRouter();

const currentUser = ref({
  userId: 1,
  displayName: 'You',
  avatarId: 1,
})

// Opponent simulation
const opponent = ref({
  userId: 1,
  displayName: 'در حال جستجو ...',
  avatarId: getRandomSearchingAvatar(),
})

const cancelButtonAttributes = {
  preStart: {
    label: 'صبر کنید ...',
    color: 'primary'
  },
  findingMatch: {
    label: 'لغو کردن',
    color: 'error'
  },
  startingMatch: {
    label: 'در حال شروع بازی ...',
    color: 'primary'
  },
}

let avatarShufflingInterval = null;

const titleLabel = ref('در جستجوی حریف ...');

const canCancel = ref(false);
const cancelButtonAttribute = ref(cancelButtonAttributes.preStart);

function getRandomSearchingAvatar() {
  return SEARCHING_AVATAR_IDS[Math.floor(Math.random() * SEARCHING_AVATAR_IDS.length)]
}

function startAvatarShuffling() {
  avatarShufflingInterval = setInterval(() => {
    opponent.value.avatarId = getRandomSearchingAvatar()
  }, 300)
}

async function requestJoinMatchMake() {
  await $karizmaConnection.connection
      .send('match-make/join');

  activeCancelButton();
}

async function requestLeaveMatchMake() {
  canCancel.value = false;

  await $karizmaConnection.connection
      .send('match-make/leave');

  emit('close');
}

function activeCancelButton() {
  cancelButtonAttribute.value = cancelButtonAttributes.findingMatch;
  canCancel.value = true;
}

function onMatchStart(data) {
  clearIntervals();

  const gameDate = gameStore();
  gameDate.setData(data);

  opponent.value = {
    userId: parseInt(data.Opponent.UserProfile.UserId),
    avatarId: parseInt(data.Opponent.UserProfile.Avatar),
    displayName: data.Opponent.UserProfile.DisplayName
  }

  titleLabel.value = 'حریف پیدا شد!'
  cancelButtonAttribute.value = cancelButtonAttributes.startingMatch;
  canCancel.value = false;

  setTimeout(() => {
    router.replace('/gameplay');
  }, 2000);
}

function subscribeServerEvents(active) {
  if (active)
    $karizmaConnection.connection.on('match/start', onMatchStart);
  else
    $karizmaConnection.connection.off('match/start');
}

function updateUserAvatar() {
  const userData = userStore();
  currentUser.value.userId = userData.userId;
  currentUser.value.displayName = userData.displayName;
  currentUser.value.avatarId = userData.avatarId;
}

function clearIntervals() {
  clearInterval(avatarShufflingInterval);
}

onMounted(() => {
  updateUserAvatar();
  startAvatarShuffling();
  subscribeServerEvents(true);

  setTimeout(() => {
    requestJoinMatchMake();
  }, 1000);
})

onUnmounted(() => {
  subscribeServerEvents(false);
  clearIntervals();
})

</script>

<style scoped>
.find-match-dialog {
  direction: rtl;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-6);
  padding: var(--space-6);
  max-height: 90vh;
  overflow: hidden;
}

.avatar-section {
  display: flex;
  justify-content: center;
  width: 100%;
}

.find-match-label {
  font-size: var(--text-lg);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
}

.vs-label {
  font-size: var(--text-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-muted);
  letter-spacing: 0.05em;
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