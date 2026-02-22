<template>
  <div class="home-items">
    <div class="home-top">
      <UserAvatar
          class="cursor-pointer home-avatar"
          :username="userDisplayName"
          :user-id="userId"
          :avatar-id="userAvatarId"
          :size="48"
          loading-strategy="eager"
          @click="onUserAvatarClicked"
      />
      <div class="resource-badges">
        <div class="resource-badge resource-badge-energy" aria-label="انرژی">
          <div class="resource-badge-row">
            <img :src="energyIcon" alt="" class="resource-icon resource-icon--energy" aria-hidden="true" />
            <span class="resource-value resource-value--energy">
            <span v-for="(c, i) in String(userEnergy + '/۵')" :key="i" class="resource-value-char">{{ c }}</span>
          </span>
          </div>
          <div class="resource-battery-wrap">
            <div class="resource-battery">
              <div
                class="resource-battery-fill"
                :class="{ 'resource-battery-fill--full': energyProgress >= 100 }"
                :style="{ width: `${energyProgress}%` }"
              />
            </div>
            <span class="resource-battery-time">
            <span v-for="(c, i) in String(energyCountdown ?? 'full')" :key="i" class="resource-battery-time-char">{{ c }}</span>
          </span>
          </div>
        </div>
        <div class="resource-badge resource-badge-coin" aria-label="سکه">
          <div class="resource-badge-row">
            <img :src="coinIcon" alt="" class="resource-icon resource-icon--coin" aria-hidden="true" />
            <span class="resource-value resource-value--coin">
            <span v-for="(c, i) in String(userCoins)" :key="i" class="resource-value-char">{{ c }}</span>
          </span>
          </div>
          <button
              type="button"
              class="resource-coin-add"
              aria-label="خرید سکه"
              @click="useGameSounds().playClick(); setActiveTab('shop')"
          >
            <Plus :size="16" :stroke-width="2.5" />
          </button>
        </div>
      </div>
    </div>

    <div class="home-tab-panels">
      <Transition :name="tabTransitionName" mode="out-in">
        <div :key="activeTab" class="tab-panel" role="tabpanel">
          <HomeTabEvents v-if="activeTab === 'events'" />
          <HomeTabHome
              v-else-if="activeTab === 'home'"
              :on-click-play="onStartGameButtonClicked"
              :on-click-leaderboard="onShowLeaderboardButtonClicked"
          />
          <HomeTabShop v-else />
        </div>
      </Transition>
    </div>

    <nav class="home-tabs" role="tablist" aria-label="منوی اصلی">
      <button
          type="button"
          class="home-tab"
          :class="{ 'home-tab--active': activeTab === 'events' }"
          role="tab"
          aria-selected="activeTab === 'events'"
          @click="useGameSounds().playClick(); setActiveTab('events')"
      >
        رویدادها
      </button>
      <button
          type="button"
          class="home-tab home-tab--center"
          :class="{ 'home-tab--active': activeTab === 'home' }"
          role="tab"
          aria-selected="activeTab === 'home'"
          @click="useGameSounds().playClick(); setActiveTab('home')"
      >
        خانه
      </button>
      <button
          type="button"
          class="home-tab"
          :class="{ 'home-tab--active': activeTab === 'shop' }"
          role="tab"
          aria-selected="activeTab === 'shop'"
          @click="useGameSounds().playClick(); setActiveTab('shop')"
      >
        فروشگاه
      </button>
    </nav>

    <!-- Base Components Finish -->

    <BaseDialog ref="editProfileDialog" show-close-button>
      <EditProfileDialog @close="onEditProfileDialogClose"/>
    </BaseDialog>

    <BaseDialog ref="noEnergyDialog">
      <div class="no-energy-content">
        <img :src="energyIcon" alt="" class="no-energy-icon" aria-hidden="true" />
        <p class="no-energy-message">انرژی کافی ندارید</p>
        <FancyButton class="no-energy-btn" title="باشه" color="primary" :onClick="() => noEnergyDialog?.hide()"/>
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
import { Plus } from 'lucide-vue-next';
import { userStore } from "~/stores/user.store";
import HomeTabEvents from '~/components/home/HomeTabEvents.vue';
import HomeTabHome from '~/components/home/HomeTabHome.vue';
import HomeTabShop from '~/components/home/HomeTabShop.vue';
import coinIcon from '~/assets/images/coin.svg';
import energyIcon from '~/assets/images/energy.svg';

const TAB_ORDER = ['events', 'home', 'shop'];

const activeTab = ref('home');
const tabDirection = ref('forward');

function setActiveTab(tab) {
  const oldIndex = TAB_ORDER.indexOf(activeTab.value);
  const newIndex = TAB_ORDER.indexOf(tab);
  tabDirection.value = newIndex > oldIndex ? 'forward' : 'back';
  activeTab.value = tab;
}

const tabTransitionName = computed(() =>
  tabDirection.value === 'forward' ? 'tab-forward' : 'tab-back'
);

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
const energyProgress = ref(100); // 0-100, charge indicator for the bar
const refillIntervalSeconds = ref(30); // from server (RegenerationIntervalSeconds)

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
      const intervalSec = res.Result?.RegenerationIntervalSeconds ?? res.Result?.regenerationIntervalSeconds;
      if (intervalSec != null && intervalSec > 0) refillIntervalSeconds.value = intervalSec;
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
    energyProgress.value = 100;
    return;
  }
  if (!next) {
    energyCountdown.value = null;
    energyProgress.value = 0;
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
    energyProgress.value = 100;
    return;
  }
  energyCountdown.value = formatCountdown(remaining);
  const interval = refillIntervalSeconds.value;
  const elapsed = Math.max(0, interval - remaining);
  energyProgress.value = Math.min(100, interval > 0 ? (elapsed / interval) * 100 : 0);
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
      const intervalSec = res.Result?.UserEnergy?.RegenerationIntervalSeconds ?? res.Result?.UserEnergy?.regenerationIntervalSeconds;
      if (intervalSec != null && intervalSec > 0) refillIntervalSeconds.value = intervalSec;
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
  padding-top: max(var(--space-3), env(safe-area-inset-top));
  padding-bottom: max(var(--space-3), env(safe-area-inset-bottom));
  padding-left: max(var(--space-3), env(safe-area-inset-left));
  padding-right: max(var(--space-3), env(safe-area-inset-right));
  overflow: hidden;
  gap: var(--space-2);
}

/* Tab bar */
.home-tabs {
  flex-shrink: 0;
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: 0;
  width: 100%;
  max-width: 320px;
  margin-top: var(--space-1);
  background: var(--bg-card);
  border: 2px solid var(--border-default);
  border-radius: var(--radius-lg);
  padding: var(--space-1);
  padding-bottom: max(var(--space-2), env(safe-area-inset-bottom));
  box-sizing: border-box;
}

.home-tab {
  flex: 1;
  padding: var(--space-2) var(--space-3);
  border: none;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--text-muted);
  font-size: var(--text-sm);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: color 0.2s ease, background 0.2s ease;
}

.home-tab:hover {
  color: var(--text-primary);
}

.home-tab--active {
  background: var(--bg-elevated);
  color: var(--text-primary);
  box-shadow: var(--shadow-sm);
}

.home-tab-panels {
  flex: 1;
  min-height: 0;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-1) 0;
}

.tab-panel {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 0;
}

/* Direction-aware tab transition: right tab = content from right, left tab = from left */
.tab-forward-enter-active,
.tab-forward-leave-active,
.tab-back-enter-active,
.tab-back-leave-active {
  transition: opacity 0.18s cubic-bezier(0.33, 1, 0.68, 1),
    transform 0.18s cubic-bezier(0.33, 1, 0.68, 1);
}

/* Going to right tab (e.g. Home → Shop): new slides in from right, old slides out to left */
.tab-forward-enter-from {
  opacity: 0;
  transform: translateX(22%);
}
.tab-forward-leave-to {
  opacity: 0;
  transform: translateX(-22%);
}

/* Going to left tab (e.g. Shop → Home): new slides in from left, old slides out to right */
.tab-back-enter-from {
  opacity: 0;
  transform: translateX(-22%);
}
.tab-back-leave-to {
  opacity: 0;
  transform: translateX(22%);
}

.home-top {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  width: 100%;
  padding-bottom: var(--space-1);
}

.home-avatar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.resource-badges {
  display: flex;
  align-items: stretch;
  gap: var(--space-2);
}

.resource-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-2);
  background: var(--bg-card);
  border: 2px solid var(--border-default);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  height: 48px;
  min-height: 48px;
  width: 108px;
  min-width: 108px;
  max-width: 108px;
  box-sizing: border-box;
}

.resource-badge-energy {
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0;
  padding: var(--space-1) var(--space-2);
  background: linear-gradient(135deg, var(--bg-card) 0%, rgba(234, 179, 8, 0.08) 100%);
  border-color: rgba(234, 179, 8, 0.35);
}

.resource-badge-energy .resource-badge-row {
  transform: translateX(-3px);
}

.resource-value--energy,
.resource-value--coin {
  display: inline-flex;
  align-items: center;
  gap: 3px;
}

.resource-value-char {
  display: inline-block;
}

.resource-badge-coin {
  flex-direction: row;
  align-items: center;
  background: linear-gradient(135deg, var(--bg-card) 0%, rgba(14, 165, 233, 0.08) 100%);
  border-color: rgba(14, 165, 233, 0.3);
}

.resource-badge-coin .resource-value {
  font-size: 1.12em;
}

.resource-badge-row {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.resource-battery-wrap {
  position: relative;
  width: 100%;
  min-width: 32px;
  min-height: 18px;
  margin-top: -2px;
  display: flex;
  align-items: center;
}

.resource-battery {
  height: 8px;
  min-height: 8px;
  width: 100%;
  background: rgba(0, 0, 0, 0.4);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.resource-battery-fill {
  position: relative;
  height: 100%;
  min-width: 2px;
  background: linear-gradient(90deg, var(--color-warning), var(--color-success));
  border-radius: inherit;
  transition: width 0.3s ease;
  overflow: hidden;
}

.resource-battery-fill--full::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    transparent 0%,
    transparent 32%,
    rgba(255, 255, 255, 0.55) 50%,
    transparent 68%,
    transparent 100%
  );
  animation: resource-battery-shine 2.2s ease-in-out infinite;
}

@keyframes resource-battery-shine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.resource-battery-time {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  font-size: 0.65rem;
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
  line-height: 1;
  pointer-events: none;
}

.resource-battery-time-char {
  display: inline-block;
  text-shadow:
    -1px -1px 0 rgba(0, 0, 0, 0.9),
     1px -1px 0 rgba(0, 0, 0, 0.9),
    -1px  1px 0 rgba(0, 0, 0, 0.9),
     1px  1px 0 rgba(0, 0, 0, 0.9),
     0 0 2px rgba(0, 0, 0, 0.9);
}

.resource-icon {
  font-size: 1rem;
  flex-shrink: 0;
}

.resource-icon--coin,
.resource-icon--energy {
  width: 1rem;
  height: 1rem;
  display: block;
  object-fit: contain;
}

.resource-value {
  min-width: 2ch;
  font-size: 0.95em;
  letter-spacing: 0;
}

.resource-coin-add {
  flex-shrink: 0;
  margin-inline-start: auto;
  width: 1.25rem;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  border-radius: var(--radius-full);
  background: var(--color-success);
  color: white;
  cursor: pointer;
  transition: transform 0.15s ease, background 0.15s ease;
}

.resource-coin-add:hover {
  background: var(--color-success-dark);
  transform: scale(1.05);
}

.resource-coin-add:active {
  transform: scale(0.98);
}

.no-energy-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
}

.no-energy-icon {
  width: 3rem;
  height: 3rem;
  display: block;
  object-fit: contain;
}

.no-energy-message {
  margin: 0;
  font-size: var(--text-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}

.no-energy-btn {
  margin-top: var(--space-5);
}
</style>