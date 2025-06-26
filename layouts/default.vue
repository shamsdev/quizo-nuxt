<template>
  <div class="app-background">
    <div class="app-wrapper">
      <NuxtPage/>
      <BaseDialog ref="msgDialogRef">
        <MessageDialog
            title="Leave Game?"
            message="Are you sure you want to leave? You will lose your current progress."
            :buttons="
            [
              { text: 'Cancel', color: '#7f8c8d', onClick: () => console.log('cancel') },
              { text: 'Leave', color: '#e74c3c', onClick: ()=>console.log('leave') }
            ]"
        />
      </BaseDialog>
    </div>
  </div>
</template>

<script setup>

const msgDialogRef = ref();

onMounted(() => {
  document.addEventListener('keydown', (event) => {
    if (event.key === 'k')
      msgDialogRef.value.show();
  });
})

</script>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

.app-wrapper {
  padding: 16px;
  max-width: 480px;
  width: 100%;
  margin: 0 auto;
  height: 100vh;
  background: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.app-background {
  min-height: 100vh;
  background: #f0f0f0; /* or an image */
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>
