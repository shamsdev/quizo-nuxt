<template>
  <NuxtLayout>
    <v-app>
      <NuxtPage/>
    </v-app>
  </NuxtLayout>
  <MessageDialog ref="msgDialogRef"/>
</template>

<script setup>
const msgDialogRef = ref();

onMounted(() => {
  useMessageDialog.register((payload) => {
    msgDialogRef.value?.show(payload.title, payload.message, payload.buttons);
  });
});

onBeforeUnmount(() => {
  useMessageDialog.unregister();
});
</script>