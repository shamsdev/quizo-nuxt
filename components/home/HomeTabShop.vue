<template>
  <div class="home-tab-shop">
    <h2 class="shop-title">خرید سکه</h2>
    <div class="shop-list-wrap">
      <div class="shop-list scroll-styled">
      <article
          v-for="pkg in coinPackages"
          :key="pkg.id"
          class="shop-card"
      >
        <div class="shop-card-coins">
          <img :src="coinIcon" alt="" class="shop-card-icon" aria-hidden="true" />
          <span class="shop-card-amount">{{ pkg.coins }}</span>
        </div>
        <div class="shop-card-extra" v-if="pkg.badge">{{ pkg.badge }}</div>
        <p class="shop-card-price">{{ pkg.price }}</p>
        <FancyButton
            class="shop-card-btn"
            :title="pkg.buttonText"
            color="success"
            :onClick="() => onBuy(pkg)"
        />
      </article>
      </div>
    </div>
  </div>
</template>

<script setup>
import FancyButton from '~/components/FancyButton.vue';
import coinIcon from '~/assets/images/coin.svg';

const coinPackages = [
  { id: 'small', coins: '۱۰۰', price: '۱,۲۰۰ تومان', buttonText: 'خرید', badge: null },
  { id: 'medium', coins: '۵۰۰', price: '۵,۰۰۰ تومان', buttonText: 'خرید', badge: 'محبوب' },
  { id: 'large', coins: '۱,۲۰۰', price: '۱۰,۰۰۰ تومان', buttonText: 'خرید', badge: '۲۰٪ بیشتر' },
  { id: 'mega', coins: '۳,۰۰۰', price: '۲۲,۰۰۰ تومان', buttonText: 'خرید', badge: 'بهترین ارزش' },
  { id: 'super', coins: '۵,۰۰۰', price: '۳۵,۰۰۰ تومان', buttonText: 'خرید', badge: null },
  { id: 'ultra', coins: '۸,۰۰۰', price: '۵۲,۰۰۰ تومان', buttonText: 'خرید', badge: 'پرفروش' },
  { id: 'max', coins: '۱۲,۰۰۰', price: '۷۵,۰۰۰ تومان', buttonText: 'خرید', badge: '۳۰٪ بیشتر' },
  { id: 'ultimate', coins: '۲۰,۰۰۰', price: '۱۱۰,۰۰۰ تومان', buttonText: 'خرید', badge: 'ویژه' },
];

function onBuy(pkg) {
  // TODO: IAP integration
  console.log('Buy', pkg.id);
}
</script>

<style scoped>
.home-tab-shop {
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

.shop-title {
  margin-top: var(--space-2);
  font-size: var(--text-xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  flex-shrink: 0;
}

.shop-list-wrap {
  flex: 1;
  min-height: 0;
  width: 100%;
}

.shop-list {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
  overflow-y: auto;
  padding: var(--space-6) var(--screen-padding-x);
  align-content: start;
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%);
  mask-image: linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%);
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
}

.shop-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-5) var(--space-4) var(--space-4);
  padding-top: var(--space-10);
  background: var(--bg-card);
  border: 2px solid var(--border-default);
  border-radius: var(--radius-lg);
  position: relative;
  min-width: 0;
}

.shop-card-coins {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-1);
}

.shop-card-icon {
  width: 1.5rem;
  height: 1.5rem;
  display: block;
  object-fit: contain;
}

.shop-card-amount {
  font-size: var(--text-xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
}

.shop-card-label {
  font-size: var(--text-sm);
  color: var(--text-muted);
}

.shop-card-extra {
  position: absolute;
  top: var(--space-2);
  left: var(--space-2);
  padding: var(--space-1) var(--space-2);
  background: var(--color-primary);
  color: var(--text-inverse);
  font-size: 0.7rem;
  font-weight: var(--font-weight-semibold);
  border-radius: var(--radius-sm);
  z-index: 1;
}

.shop-card-price {
  direction: rtl;
  margin: 0 0 var(--space-3);
  font-size: var(--text-base);
  font-weight: var(--font-weight-semibold);
  color: var(--text-secondary);
}

.shop-card-btn {
  margin-top: var(--space-2);
  width: 100%;
  max-width: 160px;
}
</style>
