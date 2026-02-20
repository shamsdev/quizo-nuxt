<template>
  <div v-if="!loading" class="user-avatar">
    <div class="avatar-wrap" :style="{ width: size + 'px', height: size + 'px' }">
      <div
          v-show="!imageLoaded"
          class="avatar-skeleton"
          :style="{ width: size + 'px', height: size + 'px' }"
          aria-hidden="true"
      />
      <picture>
        <source :srcset="avatarUrls.webp" type="image/webp" :width="size" :height="size" />
        <img
            :src="avatarUrls.png"
            :alt="username"
            class="avatar-img"
            :width="size"
            :height="size"
            :loading="loadingStrategy"
            decoding="async"
            :style="{
              borderColor: computedColor,
              width: size + 'px',
              height: size + 'px'
            }"
            @load="imageLoaded = true"
        />
      </picture>
    </div>
    <div v-if="showName" class="username" :style="{
      backgroundColor: computedColor
    }">
      <p>{{ username ?? 'Guest' }}</p>
    </div>
  </div>
  <div v-else class="avatar-loader">
    <VSkeletonLoader type="avatar" height="40"/>
    <VSkeletonLoader type="text" width="80" height="0"/>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { userStore } from '~/stores/user.store'

const props = withDefaults(
  defineProps<{
    userId?: number
    username?: string
    avatarId: number
    color?: string
    loading?: boolean
    showName?: boolean
    /** Pixel size for the image (reduces layout shift and allows smaller requests when using thumb) */
    size?: number
    /** Use 'eager' for above-the-fold avatars (e.g. home), 'lazy' for lists and secondary avatars */
    loadingStrategy?: 'lazy' | 'eager'
  }>(),
  {
    username: 'Guest',
    loading: false,
    showName: true,
    size: 105,
    loadingStrategy: 'lazy',
  }
)

const computedColor = computed(() => {
  if (props.color) return props.color
  /* You = electric blue, opponent = violet */
  return userStore().userId === props.userId ? 'var(--color-primary)' : 'var(--color-secondary)'
})

const avatarUrls = computed(() => useAvatarUrl(props.avatarId));
const imageLoaded = ref(false);
watch(() => props.avatarId, () => { imageLoaded.value = false; });

</script>

<style scoped>
.user-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.avatar-wrap {
  position: relative;
  flex-shrink: 0;
}

.avatar-skeleton {
  position: absolute;
  inset: 0;
  border-radius: var(--radius-full);
  background: var(--bg-elevated);
}

.avatar-loader {
  scale: 2.2;
  height: 80px;
  margin-top: 30px;
  margin-bottom: 12px;
}

.avatar-img {
  position: relative;
  z-index: 1;
  border-radius: var(--radius-full);
  border: 3px solid;
  object-fit: cover;
  flex-shrink: 0;
}

.username {
  border-radius: var(--radius-xl);
  padding: var(--space-1) var(--space-2);
  margin-top: calc(-1 * var(--space-2));
  font-size: var(--text-sm);
  font-weight: var(--font-weight-medium);
}

.username p {
  color: var(--text-primary);
  font-size: var(--text-sm);
  font-weight: var(--font-weight-semibold);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
