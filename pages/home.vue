<template>
  <div class="home-items">
    <div class="home-top">
      <UserAvatar
          class="cursor-pointer home-avatar"
          :username="userDisplayName"
          :user-id="userId"
          :avatar-id="userAvatarId"
          :size="72"
          loading-strategy="eager"
          @click="onUserAvatarClicked"
      />
      <div class="resource-badges">
        <div class="resource-badge resource-badge-energy" aria-label="انرژی">
          <div class="resource-badge-main">
            <span class="resource-icon">⚡</span>
            <span class="resource-value">{{ userEnergy }}</span>
          </div>
          <div v-if="userEnergy >= 5" class="resource-badge-countdown resource-badge-full">
            پر
          </div>
          <div v-else-if="energyCountdown !== null" class="resource-badge-countdown">
            <span class="countdown-label">بعدی</span> {{ energyCountdown }}
          </div>
        </div>
        <div class="resource-badge resource-badge-coin" aria-label="سکه">
          <span class="resource-icon">🪙</span>
          <span class="resource-value">{{ userCoins }}</span>
        </div>
      </div>
    </div>

    <div class="home-actions">
      <FancyButton
          class="play-button start-game-btn"
          title="شروع بازی"
          :icon="Gamepad2"
          color="play"
          cost="⚡ ۱"
          :onClick="onStartGameButtonClicked"
      />
      <FancyButton
          class="leaderboard-btn"
          title="جدول امتیازات"
          :icon="List"
          color="leaderboard"
          :onClick="onShowLeaderboardButtonClicked"
      />
    </div>

    <HomeFooter />

    <!-- Base Components Finish -->

    <BaseDialog ref="editProfileDialog" show-close-button>
      <EditProfileDialog @close="onEditProfileDialogClose"/>
    </BaseDialog>

    <BaseDialog ref="noEnergyDialog">
      <div class="no-energy-content">
        <p class="no-energy-message">انرژی کافی ندارید</p>
        <FancyButton class="mt-2" title="باشه" color="primary" :onClick="() => noEnergyDialog?.hide()"/>
      </div>
    </BaseDialog>

    <BaseDialog ref="findMatchDialog" :close-on-background="false">
      <FindMatchDialog @close="onFindMatchDialogClose"/>
    </BaseDialog>

    <BaseDialog ref="leaderboardDialog" show-close-button>
      <LeaderboardDialog @close="leaderboardDialog?.hide()"/>
    </BaseDialog>

  </div>
</template>

<script setup>
import {Gamepad2, List} from 'lucide-vue-next'
import {userStore} from "~/stores/user.store";

const editProfileDialog = ref();
const noEnergyDialog = ref();
const findMatchDialog = ref();
const leaderboardDialog = ref();

const userDisplayName = ref(null);
const userAvatarId = ref(1);
const userId = ref(1);
const userCoins = ref(0);
const userEnergy = ref(0);
const energyNextAt = ref(null);
const energyCountdown = ref(null);

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
function toPersianDigits(n) {
  return String(n).replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)]);
}
function formatCountdown(seconds) {
  if (seconds <= 0) return null;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${toPersianDigits(m)}:${toPersianDigits(String(s).padStart(2, '0'))}`;
}

async function fetchEnergies() {
  const { $karizmaConnection } = useNuxtApp();
  const userData = userStore();
  try {
    const res = await $karizmaConnection.connection.request('user/get-energies');
    if (!res.HasError && res.Result) {
      userData.setEnergyData(res.Result);
      userEnergy.value = res.Result.Amount;
      energyNextAt.value = res.Result.NextGenerationAt ?? null;
      tickEnergyCountdown();
    }
  } catch (_) {
    userEnergy.value = userData.energy;
    energyNextAt.value = userData.energyNextAt;
    tickEnergyCountdown();
  }
}

function tickEnergyCountdown() {
  const next = energyNextAt.value;
  const amt = userEnergy.value;
  if (amt >= 5) {
    energyCountdown.value = null;
    return;
  }
  if (!next) {
    energyCountdown.value = null;
    return;
  }
  const now = Date.now();
  const nextMs = new Date(next).getTime();
  const remaining = Math.ceil((nextMs - now) / 1000);
  if (remaining <= 0) {
    if (energyCountdown.value !== null) {
      energyCountdown.value = null;
      fetchEnergies();
    }
    return;
  }
  energyCountdown.value = formatCountdown(remaining);
}

async function fetchHomeData() {
  const { $karizmaConnection } = useNuxtApp();
  const userData = userStore();
  try {
    const res = await $karizmaConnection.connection.request('user/get-home-data');
    if (!res.HasError && res.Result) {
      userData.setHomeData(res.Result);
      userCoins.value = res.Result.UserResource.Coin;
      userEnergy.value = res.Result.UserEnergy.Amount;
      energyNextAt.value = res.Result.UserEnergy.NextGenerationAt ?? null;
      tickEnergyCountdown();
    }
  } catch (_) {
    userCoins.value = userData.coins;
    userEnergy.value = userData.energy;
    energyNextAt.value = userData.energyNextAt;
    tickEnergyCountdown();
  }
}

function onUserAvatarClicked() {
  useGameSounds().playClick();
  editProfileDialog.value?.show();
}

function onStartGameButtonClicked() {
  useGameSounds().playClick();
  if (userEnergy.value < 1) {
    noEnergyDialog.value?.show();
    return;
  }
  findMatchDialog.value?.show();
}

function onFindMatchDialogClose() {
  findMatchDialog.value?.hide();
  fetchHomeData();
}

function onShowLeaderboardButtonClicked() {
  console.log('onShowLeaderboardButtonClicked');
  leaderboardDialog.value?.show();
}

function updateUserProfileData() {
  const userData = userStore();
  userDisplayName.value = userData.displayName;
  userAvatarId.value = userData.avatarId;
  userId.value = userData.userId;
  userCoins.value = userData.coins;
  userEnergy.value = userData.energy;
  energyNextAt.value = userData.energyNextAt;
  tickEnergyCountdown();
}

function onEditProfileDialogClose() {
  updateUserProfileData();
  editProfileDialog.value?.hide();
}

onBeforeMount(() => {
  updateUserProfileData();
});

let countdownInterval = null;

onMounted(() => {
  fetchHomeData();
  countdownInterval = setInterval(tickEnergyCountdown, 1000);
});

onUnmounted(() => {
  if (countdownInterval) clearInterval(countdownInterval);
});

</script>

<style scoped>
.home-items {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: space-between;
  padding-top: max(var(--space-4), env(safe-area-inset-top));
  padding-bottom: max(var(--space-4), env(safe-area-inset-bottom));
  padding-left: max(var(--space-4), env(safe-area-inset-left));
  padding-right: max(var(--space-4), env(safe-area-inset-right));
  overflow: hidden;
}

.home-top {
  flex-shrink: 0;
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: var(--space-4);
  flex-wrap: wrap;
  min-height: 88px;
}

.home-avatar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.resource-badges {
  display: flex;
  align-items: stretch;
  gap: var(--space-3);
}

.resource-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  background: var(--bg-card);
  border: 2px solid var(--border-default);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  min-height: 72px;
  box-sizing: border-box;
}

.resource-badge-energy {
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
  min-width: 72px;
  background: linear-gradient(135deg, var(--bg-card) 0%, rgba(234, 179, 8, 0.08) 100%);
  border-color: rgba(234, 179, 8, 0.35);
}

.resource-badge-coin {
  background: linear-gradient(135deg, var(--bg-card) 0%, rgba(14, 165, 233, 0.08) 100%);
  border-color: rgba(14, 165, 233, 0.3);
}

.resource-badge-main {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.resource-badge-countdown {
  font-size: var(--text-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
  display: flex;
  align-items: center;
  gap: 4px;
}

.countdown-label {
  font-size: 0.95em;
  opacity: 0.95;
}

.resource-badge-full {
  color: var(--color-success);
}

.resource-icon {
  font-size: 1.35em;
}

.resource-value {
  min-width: 2ch;
  font-size: 1.05em;
}

.home-actions {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-6);
  min-height: 0;
}

.home-actions .fancy-button {
  width: 260px;
  min-width: 260px;
  flex-shrink: 0;
}

.play-button.start-game-btn {
  border-radius: var(--radius-lg);
}

.leaderboard-btn {
  height: var(--button-height);
}

.no-energy-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
}

.no-energy-message {
  margin: 0;
  font-size: var(--text-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}
</style>