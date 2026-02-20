<template>
  <div class="home-items">
    <div class="home-top">
      <UserAvatar
          class="cursor-pointer"
          :username="userDisplayName"
          :user-id="userId"
          :avatar-id="userAvatarId"
          loading-strategy="eager"
          @click="onUserAvatarClicked"
      />
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

function onUserAvatarClicked() {
  console.log('onUserAvatarClicked');
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
}

function onEditProfileDialogClose(){
  updateUserProfileData();
  editProfileDialog.value?.hide();
}

onBeforeMount(() => {
  updateUserProfileData();
})

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