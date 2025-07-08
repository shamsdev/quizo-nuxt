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

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;

  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

</style>