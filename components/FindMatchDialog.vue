<template>
  <div class="find-match-dialog">
    <div class="find-match-label">{{ titleLabel }}</div>
    <!-- Opponent Avatar -->
    <transition name="fade">
      <div class="avatar-section">
        <UserAvatar
            :user-id="opponent.userId"
            :username="opponent.displayName"
            :avatarId="opponent.avatarId"
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
          :avatarId="currentUser.avatarId"/>
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
import {TOTAL_AVATARS_COUNT} from "~/constants/settings.js";
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
  avatarId: getRandomAvatar(),
})

const cancelButtonAttributes = {
  preStart: {
    label: 'صبر کنید ...',
    color: '#118194'
  },
  findingMatch: {
    label: 'لغو کردن',
    color: '#d3593e'
  },
  startingMatch: {
    label: 'در حال شروع بازی ...',
    color: '#118194'
  },
}

let avatarShufflingInterval = null;

const titleLabel = ref('در جستجوی حریف ...');

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