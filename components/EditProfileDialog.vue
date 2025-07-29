<template>
  <div class="edit-profile-dialog">
    <!-- Top Section: Username -->
    <div class="form-section">
      <label for="username" class="input-label">نام شما</label>
      <input
          id="username"
          v-model="displayName"
          class="text-input"
          type="text"
          dir="rtl"
          :disabled="isSubmitting"
          placeholder="نام خود را وارد کنید"
          maxlength="20"
      />
    </div>

    <!-- Avatar Section Label (outside scroll) -->
    <div class="form-section mt-3">
      <label class="input-label">انتخاب آواتار</label>
    </div>

    <!-- Scrollable Avatar List -->
    <div class="avatar-scroll-section" ref="avatarScrollSection">
      <div class="avatar-list">
        <div
            v-for="id in avatarsIds"
            :key="id"
            :ref="el => { if (el) avatarRefs[id] = el }"
            class="avatar-item"
            :class="{ selected: id === avatarId }"
            @click="avatarId = isSubmitting ? avatarId : id"
        >
          <img :src="`/images/avatars/${id}.png`" :alt="id"/>
        </div>
      </div>
    </div>

    <!-- Bottom Section: Apply Button -->
    <div class="form-section button-wrapper">
      <FancyButton
          title="قبول"
          :onClick="requestUpdateProfile"
          :disabled="isSubmitting"
          color="#27ae60"
      />
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import FancyButton from './FancyButton.vue';
import {TOTAL_AVATARS_COUNT} from "~/constants/settings.js";
import {userStore} from "~/stores/user.store";

const emit = defineEmits(['close']);
const {$karizmaConnection} = useNuxtApp();
const userData = userStore();

const displayName = ref(null);
const avatarId = ref(1);
const avatarScrollSection = ref(null);
const avatarRefs = ref({});

const avatarsIds = ref(
    Array.from({length: TOTAL_AVATARS_COUNT}, (_, i) => i + 1)
)

const isSubmitting = ref(false);

const requestUpdateProfile = async () => {
  isSubmitting.value = true;

  const requestData = {
    Avatar: avatarId.value.toString(),
    DisplayName: displayName.value
  };

  const updateProfileResult = await $karizmaConnection.connection
      .request('user/update-profile', requestData);

  userData.setProfile(updateProfileResult.Result);
  emit('close');
}

const scrollToSelectedAvatar = () => {
  nextTick(() => {
    const selectedAvatarElement = avatarRefs.value[avatarId.value];
    const scrollContainer = avatarScrollSection.value;

    if (selectedAvatarElement && scrollContainer) {
      const selectedRect = selectedAvatarElement.getBoundingClientRect();
      const containerRect = scrollContainer.getBoundingClientRect();

      // Calculate the position of the selected avatar relative to the scroll container's top edge
      const relativeOffsetTop = selectedRect.top - containerRect.top;

      // Calculate the desired scroll position to center the selected avatar
      // Current scroll position + (relative offset of selected avatar + half its height) - (half container height)
      const targetScrollTop = scrollContainer.scrollTop + relativeOffsetTop + (selectedRect.height / 2) - (containerRect.height / 2);

      scrollContainer.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth'
      });
    }
  });
};

onMounted(() => {
  displayName.value = userData.displayName;
  avatarId.value = userData.avatarId;
  scrollToSelectedAvatar();
})

defineExpose({ scrollToSelectedAvatar });
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
  direction: rtl;
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
