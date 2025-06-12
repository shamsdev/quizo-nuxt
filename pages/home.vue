<script setup lang="ts">
import {Gamepad2, List} from 'lucide-vue-next'

const editProfileDialog = ref();
const findMatchDialog = ref();
const leaderboardDialog = ref();

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

</script>

<template>
  <div class="home-items">

    <!-- Base Components Start -->
    <UserAvatar class="cursor-pointer"
                username="Mohammad"
                avatarId="19"
                @click="onUserAvatarClicked"
    />

    <FancyButton
        class="start-game-btn mt-15"
        title="Start Game"
        :icon="Gamepad2"
        color="#e67e22"
        :onClick="onStartGameButtonClicked"
    />

    <FancyButton
        class="leaderboard-btn mt-8"
        title="Leaderboard"
        :icon="List"
        color="#e67e22"
        :onClick="onShowLeaderboardButtonClicked"
    />

    <HomeFooter/>

    <!-- Base Components Finish -->

    <BaseDialog ref="editProfileDialog">
      <EditProfileDialog @close="editProfileDialog?.hide()"/>
    </BaseDialog>

    <BaseDialog ref="findMatchDialog" :close-on-background="false">
      <FindMatchDialog @close="findMatchDialog?.hide()"/>
    </BaseDialog>

    <BaseDialog ref="leaderboardDialog">
      <LeaderboardDialog @close="leaderboardDialog?.hide()"/>
    </BaseDialog>

  </div>
</template>

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