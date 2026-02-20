<template>
  <div class="home-items">
    <div class="home-top">
      <UserAvatar
          class="cursor-pointer home-avatar"
          :username="userDisplayName"
          :user-id="userId"
          :avatar-id="userAvatarId"
          :size="56"
          loading-strategy="eager"
          @click="onUserAvatarClicked"
      />
      <div class="resource-badges">
        <div class="resource-badge" aria-label="انرژی">
          <span class="resource-icon">⚡</span>
          <span class="resource-value">{{ userEnergy }}</span>
        </div>
        <div class="resource-badge" aria-label="سکه">
          <span class="resource-icon">🪙</span>
          <span class="resource-value">{{ userCoins }}</span>
        </div>
      </div>
    </div>

    <div class="home-actions">
      <FancyButton
          class="start-game-btn"
          title="شروع بازی"
          :icon="Gamepad2"
          color="play"
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

    <BaseDialog ref="findMatchDialog" :close-on-background="false">
      <FindMatchDialog @close="findMatchDialog?.hide()"/>
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
const findMatchDialog = ref();
const leaderboardDialog = ref();

const userDisplayName = ref(null);
const userAvatarId = ref(1);
const userId = ref(1);
const userCoins = ref(0);
const userEnergy = ref(0);

async function fetchHomeData() {
  const { $karizmaConnection } = useNuxtApp();
  const userData = userStore();
  try {
    const res = await $karizmaConnection.connection.request('user/get-home-data');
    if (!res.HasError && res.Result) {
      userData.setHomeData(res.Result);
      userCoins.value = res.Result.UserResource.Coin;
      userEnergy.value = res.Result.UserEnergy.Amount;
    }
  } catch (_) {
    userCoins.value = userData.coins;
    userEnergy.value = userData.energy;
  }
}

function onUserAvatarClicked() {
  useGameSounds().playClick();
  editProfileDialog.value?.show();
}

function onStartGameButtonClicked() {
  console.log('onStartGameButtonClicked');
  findMatchDialog.value?.show();
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
}

function onEditProfileDialogClose() {
  updateUserProfileData();
  editProfileDialog.value?.hide();
}

onBeforeMount(() => {
  updateUserProfileData();
});

onMounted(() => {
  fetchHomeData();
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
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.home-avatar {
  flex-shrink: 0;
}

.resource-badges {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.resource-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background: var(--bg-card);
  border: 2px solid var(--border-default);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}

.resource-icon {
  font-size: 1.1em;
}

.resource-value {
  min-width: 1.5ch;
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

.start-game-btn {
  width: var(--button-min-width);
  min-width: 220px;
  height: var(--button-height);
  flex-shrink: 0;
}

.leaderboard-btn {
  width: var(--button-min-width);
  min-width: 220px;
  height: var(--button-height);
  flex-shrink: 0;
}
</style>