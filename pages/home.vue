<script setup lang="ts">
import {Gamepad} from 'lucide-vue-next'
</script>

<template>
  <div class="home-items">
    <UserAvatar username="Mohammad" avatarId="19"/>
    <FancyButton
        class="start-game-btn mt-8"
        title="Start Game"
        :icon="Gamepad"
        color="#e67e22"
        :onClick="() => console.log('Clicked!')"
    />
  </div>
</template>

<style scoped>
.home-items {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.start-game-btn {
  width: 220px;
}
</style>