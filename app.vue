<template>
  <NuxtLayout>
    <VitePwaManifest/>
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
  font-family: ModamFaNumWeb, sans-serif !important;
  margin: 0;
  padding: 0;
  height: 100%;
  background: linear-gradient(165deg, var(--bg-outer) 0%, var(--bg-outer-end) 100%);
  color: var(--text-primary);
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.cursor-pointer {
  cursor: pointer;
}
</style>