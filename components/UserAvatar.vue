<template>
  <div v-if="!loading" class="user-avatar">
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
      />
    </picture>
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
  return props.color ?? userStore().userId === props.userId ? '#05A8AA' : '#DC602E'
})

const avatarUrls = computed(() => useAvatarUrl(props.avatarId))

</script>

<style scoped>
.user-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.avatar-loader {
  scale: 2.2;
  height: 80px;
  margin-top: 30px;
  margin-bottom: 12px;
}

.avatar-img {
  border-radius: 50%;
  border: 4px solid;
  object-fit: cover;
  flex-shrink: 0;
}

.username {
  border-radius: 20px;
  padding: 2px 8px;
  margin-top: -8px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.username p {
  color: white;
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
