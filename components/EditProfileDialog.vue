<template>
  <div class="edit-profile-dialog">
    <!-- Top Section: Username -->
    <div class="form-section">
      <label for="username" class="input-label">Username</label>
      <input
          id="username"
          v-model="username"
          class="text-input"
          type="text"
          placeholder="Enter your username"
      />
    </div>

    <!-- Avatar Section Label (outside scroll) -->
    <div class="form-section">
      <label class="input-label">Choose Your Avatar</label>
    </div>

    <!-- Scrollable Avatar List -->
    <div class="avatar-scroll-section">
      <div class="avatar-list">
        <div
            v-for="avatarId in avatarsIds"
            :key="avatarId"
            class="avatar-item"
            :class="{ selected: avatarId === selectedAvatarId }"
            @click="selectedAvatarId = avatarId"
        >
          <img :src="`/images/avatars/${avatarId}.png`" :alt="avatarId"/>
        </div>
      </div>
    </div>

    <!-- Bottom Section: Apply Button -->
    <div class="form-section button-wrapper">
      <FancyButton
          title="Apply"
          :onClick="applyChanges"
          color="#27ae60"
      />
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import FancyButton from './FancyButton.vue'
import {TOTAL_AVATARS_COUNT} from "~/constants/settings.js";

const emit = defineEmits(['close'])

const username = ref('PlayerOne')
const selectedAvatarId = ref(1)

const avatarsIds = ref(
    Array.from({length: TOTAL_AVATARS_COUNT}, (_, i) => i + 1)
)

const applyChanges = () => {
  console.log('Username:', username.value)
  console.log('Avatar:', selectedAvatarId.value)
  emit('close');
}
</script>

<style scoped>
.edit-profile-dialog {
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  padding: 16px;
  box-sizing: border-box;
  overflow: hidden;
}

/* Fixed Top and Bottom Sections */
.form-section {
  flex-shrink: 0;
  margin-bottom: 12px;
}

/* Scrollable Avatar Section */
.avatar-scroll-section {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 16px;
  max-height: 320px;
}

.input-label {
  font-weight: 600;
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
  display: block;
}

.text-input {
  padding: 10px 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  width: 100%;
  box-sizing: border-box;
  outline: none;
}

.text-input:focus {
  border-color: #3498db;
}

.avatar-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

.avatar-item {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border 0.2s ease;
}

.avatar-item.selected {
  border: 3px solid #3498db;
  box-shadow: 0 0 0 5px rgba(52, 152, 219, 0.2);
}

.avatar-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.button-wrapper {
  display: flex;
  justify-content: center;
}
</style>
