<template>
  <div v-if="!loading" class="user-avatar">
    <img
        :src="avatarUrl"
        :alt="username"
        class="avatar-img"
        :style="{
          borderColor: computedColor
        }"
    />
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

<script setup>
import {computed} from 'vue'
import {userStore} from "~/stores/user.store";

const props = defineProps({
  userId: {
    type: Number,
    required: false,
  },
  username: {
    type: String,
    required: false,
    default: 'Guest'
  },
  avatarId: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  showName: {
    type: Boolean,
    required: false,
    default: true,
  },
})

const computedColor = computed(() => {
  return props.color ?? userStore().userId === props.userId ? '#05A8AA' : '#DC602E'
});

const avatarUrl = computed(() =>
    `/images/avatars/${props.avatarId}.png` // Replace with your actual image URL pattern
)

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
  width: 105px;
  height: 105px;
  border-radius: 50%;
  border: 4px solid;
  object-fit: cover;
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
