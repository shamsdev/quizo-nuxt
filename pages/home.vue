<script setup lang="ts">
import {Gamepad2, List} from 'lucide-vue-next'

function onUserAvatarClicked() {
  console.log('onUserAvatarClicked');
}

function onStartGameButtonClicked() {
  console.log('onStartGameButtonClicked');
}

function onShowLeaderboardButtonClicked() {
  console.log('onShowLeaderboardButtonClicked');
}

</script>

<template>
  <div class="home-items">

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