<template>
  <div class="contact-us-dialog">
    <!-- Email Section -->
    <div class="form-section">
      <label for="email" class="input-label">Your Email</label>
      <input
          id="email"
          v-model="email"
          class="text-input"
          type="email"
          :disabled="isSubmitting"
          placeholder="Enter your email"
      />
    </div>

    <!-- Message Section -->
    <div class="form-section">
      <label for="message" class="input-label">Message</label>
      <textarea
          id="message"
          v-model="message"
          class="textarea-input"
          :disabled="isSubmitting"
          placeholder="Enter your message"
          rows="5"
      ></textarea>
    </div>

    <!-- Bottom Section: Send Button -->
    <div class="form-section button-wrapper">
      <FancyButton
          title="Send"
          :onClick="requestSendContact"
          :disabled="isSubmitting"
          color="#3498db"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import FancyButton from './FancyButton.vue';
import { useMessageDialog } from '~/composables/useMessageDialog';

const emit = defineEmits(['close']);
const {$karizmaConnection} = useNuxtApp();

const email = ref('');
const message = ref('');
const isSubmitting = ref(false);

const requestSendContact = async () => {
  isSubmitting.value = true;

  const requestData = {
    Email: email.value,
    Message: message.value
  };

  try {
    await $karizmaConnection.connection.request('user/contact', requestData);
    useMessageDialog.show({ title: 'Success', message: 'Your message has been sent successfully.', closeOnBackground: true });
    emit('close');
  } catch (error) {
    useMessageDialog.show({ title: 'Error', message: 'There was an error sending your message. Please try again later.' });
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
.contact-us-dialog {
  display: flex;
  flex-direction: column;
  padding: 16px;
  box-sizing: border-box;
  overflow: hidden;
}

.form-section {
  margin-bottom: 12px;
}

.input-label {
  font-weight: 600;
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
  display: block;
}

.text-input,
.textarea-input {
  padding: 10px 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  width: 100%;
  box-sizing: border-box;
  outline: none;
  resize: none;
}

.text-input:focus,
.textarea-input:focus {
  border-color: #3498db;
}

.button-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
</style>
