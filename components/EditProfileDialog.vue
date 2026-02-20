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

    <!-- Scrollable Avatar List -->
    <div class="avatar-scroll-section scroll-styled" ref="avatarScrollSection">
      <div class="avatar-list">
        <div
            v-for="id in avatarsIds"
            :key="id"
            :ref="el => { if (el) avatarRefs[id] = el }"
            class="avatar-item"
            :class="{ selected: id === avatarId }"
            @click="avatarId = isSubmitting ? avatarId : id"
        >
          <UserAvatar
            :avatar-id="id"
            :show-name="false"
            :size="64"
            loading-strategy="lazy"
            class="avatar-picker-thumb"
          />
        </div>
      </div>
    </div>
    </div>

    <!-- Bottom Section: Apply Button -->
    <div class="form-section button-wrapper">
      <FancyButton
          title="قبول"
          :onClick="requestUpdateProfile"
          :disabled="isSubmitting"
          color="success"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FancyButton from './FancyButton.vue'
import { TOTAL_AVATARS_COUNT } from '~/constants/settings.js'
import { userStore } from '~/stores/user.store'

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
  padding: var(--space-4);
  box-sizing: border-box;
  overflow: hidden;
}

.form-section {
  flex-shrink: 0;
  margin-bottom: var(--space-3);
}

.form-section.mt-3 {
  margin-top: var(--space-3);
}

.avatar-scroll-section {
  flex: 1;
  overflow-y: auto;
  margin-bottom: var(--space-4);
  max-height: 320px;
}

.input-label {
  font-weight: var(--font-weight-semibold);
  font-size: var(--text-sm);
  color: var(--text-primary);
  margin-bottom: var(--space-4);
  display: block;
  direction: rtl;
}

.text-input {
  padding: var(--space-3) var(--space-4);
  border: 2px solid var(--border-default);
  border-radius: var(--radius-sm);
  font-size: var(--text-base);
  width: 100%;
  box-sizing: border-box;
  outline: none;
  background: var(--bg-card);
  color: var(--text-primary);
}

.text-input::placeholder {
  color: var(--text-muted);
}

.text-input:focus {
  border-color: var(--color-primary);
}

.avatar-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  justify-content: center;
}

.avatar-item {
  width: var(--avatar-size-md);
  height: var(--avatar-size-md);
  border-radius: var(--radius-full);
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border 0.2s ease, box-shadow 0.2s ease;
}

.avatar-item.selected {
  border: 5px solid var(--color-primary);
  box-shadow: 0 0 5px 8px rgba(6, 182, 212, 0.35);
}

.avatar-picker-thumb {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.avatar-picker-thumb :deep(.avatar-img) {
  border-width: 0;
}

.button-wrapper {
  display: flex;
  justify-content: center;
}
</style>
