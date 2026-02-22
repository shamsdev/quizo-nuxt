<template>
  <div class="home-tab-events">
    <h2 class="events-title">رویدادها</h2>
    <div class="events-list-wrap">
      <div class="events-list scroll-styled">
      <article
          v-for="event in events"
          :key="event.id"
          class="event-card"
      >
        <div class="event-card-header">
          <span class="event-card-badge" :class="event.badgeClass">{{ event.badgeText }}</span>
          <span class="event-card-date">{{ event.date }}</span>
        </div>
        <h3 class="event-card-title">{{ event.title }}</h3>
        <p class="event-card-desc">{{ event.description }}</p>
        <FancyButton
            class="event-card-btn"
            :title="event.buttonText"
            color="primary"
            :onClick="() => onEventAction(event)"
        />
      </article>
      </div>
    </div>
  </div>
</template>

<script setup>
import FancyButton from '~/components/FancyButton.vue';

const events = [
  {
    id: 'daily',
    title: 'چالش روزانه',
    description: 'هر روز ۵ سوال پاسخ دهید و تا ۵۰ سکه جایزه بگیرید.',
    date: 'هر روز',
    badgeText: 'فعال',
    badgeClass: 'event-badge--active',
    buttonText: 'شرکت',
  },
  {
    id: 'weekly',
    title: 'رویداد هفتگی',
    description: 'در ۱۰ بازی برنده شوید و به جدول برتر هفته راه پیدا کنید.',
    date: 'تا پایان هفته',
    badgeText: 'جدید',
    badgeClass: 'event-badge--new',
    buttonText: 'مشاهده',
  },
  {
    id: 'special',
    title: 'مسابقهٔ ویژه',
    description: 'مسابقهٔ بزرگ با جوایز نقدی. ثبت‌نام تا فردا.',
    date: '۲ روز مانده',
    badgeText: 'محدود',
    badgeClass: 'event-badge--limited',
    buttonText: 'ثبت‌نام',
  },
];

function onEventAction(event) {
  // TODO: navigate or open event detail
  console.log('Event action', event.id);
}
</script>

<style scoped>
.home-tab-events {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 0;
  overflow: hidden;
  padding: var(--space-1) var(--screen-padding-x);
  box-sizing: border-box;
}

.events-title {
  margin: 0 0 var(--space-3);
  font-size: var(--text-xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  flex-shrink: 0;
  letter-spacing: -0.02em;
}

.events-list-wrap {
  flex: 1;
  min-height: 0;
  width: 100%;
}

.events-list {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  overflow-y: auto;
  padding: var(--space-5) var(--screen-padding-x);
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%);
  mask-image: linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%);
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
}

.event-card {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: var(--space-3);
  background: var(--bg-card);
  border: 2px solid var(--border-default);
  border-radius: var(--radius-lg);
}

.event-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-2);
}

.event-card-badge {
  padding: var(--space-1) var(--screen-padding-x);
  font-size: 0.7rem;
  font-weight: var(--font-weight-semibold);
  border-radius: var(--radius-sm);
}

.event-badge--active {
  background: rgba(34, 197, 94, 0.25);
  color: var(--color-success);
}

.event-badge--new {
  background: rgba(14, 165, 233, 0.25);
  color: var(--color-primary);
}

.event-badge--limited {
  background: rgba(234, 179, 8, 0.25);
  color: var(--color-warning);
}

.event-card-date {
  font-size: var(--text-sm);
  color: var(--text-muted);
}

.event-card-title {
  margin: 0 0 var(--space-1);
  font-size: var(--text-base);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
}

.event-card-desc {
  margin: 0 0 var(--space-2);
  font-size: var(--text-sm);
  color: var(--text-muted);
  line-height: 1.45;
}

.event-card-btn {
  align-self: center;
  min-width: 120px;
}
</style>
