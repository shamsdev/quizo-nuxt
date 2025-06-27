<template>
  <div class="home-items">

    <UserAvatar class="cursor-pointer"
                :username="userDisplayName"
                :avatarId="userAvatarId"
                @click="onUserAvatarClicked"
    />

    <FancyButton
        class="start-game-btn mt-15"
        title="Start Game"
        :icon="Gamepad2"
        color="#218c74"
        :onClick="onStartGameButtonClicked"
    />

    <FancyButton
        class="leaderboard-btn mt-8"
        title="Leaderboard"
        :icon="List"
        color="#227093"
        :onClick="onShowLeaderboardButtonClicked"
    />

    <HomeFooter/>

    <!-- Base Components Finish -->

    <BaseDialog ref="editProfileDialog">
      <EditProfileDialog @close="onEditProfileDialogClose"/>
    </BaseDialog>

    <BaseDialog ref="findMatchDialog" :close-on-background="false">
      <FindMatchDialog @close="findMatchDialog?.hide()"/>
    </BaseDialog>

    <BaseDialog ref="leaderboardDialog">
      <LeaderboardDialog @close="leaderboardDialog?.hide()"/>
    </BaseDialog>

  </div>
</template>

<script setup>
import {Gamepad2, List} from 'lucide-vue-next'
import {userDataStore} from "~/stores/user-data.store";

const editProfileDialog = ref();
const findMatchDialog = ref();
const leaderboardDialog = ref();

const userDisplayName = ref(null);
const userAvatarId = ref(1);

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
  const userData = userDataStore();
  userDisplayName.value = userData.displayName;
  userAvatarId.value = userData.avatarId;
}

function onEditProfileDialogClose(){
  updateUserProfileData();
  editProfileDialog.value?.hide();
}

onMounted(() => {
  updateUserProfileData();
})

</script>

<style scoped>

.home-items {
  padding-top: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.start-game-btn {
  width: 220px;
  height: 60px;
}

.leaderboard-btn {
  width: 220px;
  height: 60px;
}
</style>