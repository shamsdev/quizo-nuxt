<template>
  <div class="home-tab-home">
    <section class="home-middle-section">

      <div class="mt-4">
        <h2 class="home-carousel-title">مسابقات داغ</h2>
        <div class="home-carousel">
          <div class="home-carousel-viewport-wrap">
            <div
                ref="carouselViewportRef"
                class="home-carousel-viewport"
                :style="carouselVars"
                @touchstart="onTouchStart"
                @touchmove.prevent="onTouchMove"
                @touchend="onTouchEnd"
                @touchcancel="onTouchEnd"
            >
              <div class="home-carousel-container">
                <div
                    v-for="(item, index) in carouselItems"
                    :key="item.carouselKey"
                    class="home-carousel-item"
                    :class="{ 'home-carousel-item--active': index === scrollIndex }"
                    role="group"
                    aria-roledescription="slide"
                    @click="onTournamentClick(item)"
                >
                  <div class="tour-card">
                    <div class="tour-card-glow" />
                    <span class="tour-card-badge">{{ item.badge }}</span>
                    <div class="tour-card-prize">
                      <span class="tour-card-prize-icon">🏆</span>
                      <span class="tour-card-prize-text">{{ item.prize }}</span>
                    </div>
                    <h3 class="tour-card-title">{{ item.title }}</h3>
                    <p class="tour-card-meta">{{ item.meta }}</p>
                    <span class="tour-card-cta">شرکت</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="home-carousel-arrows">
            <button
                type="button"
                class="home-carousel-arrow home-carousel-arrow-prev"
                aria-label="قبلی"
                :disabled="!canScrollPrev"
                @click="scrollPrev"
            >
              ‹
            </button>
            <button
                type="button"
                class="home-carousel-arrow home-carousel-arrow-next"
                aria-label="بعدی"
                :disabled="!canScrollNext"
                @click="scrollNext"
            >
              ›
            </button>
          </div>
        </div>
      </div>

    </section>

    <div class="home-bottom-bar">
      <div class="quick-match-wrap">
        <FancyButton
          class="quick-match-btn"
          title="بازی سریع"
          :icon="Gamepad2"
          color="play"
          cost="۱"
          :cost-icon="energyIcon"
          :onClick="onClickPlay"
        />
      </div>
      <button
        type="button"
        class="leaderboard-cup-btn"
        aria-label="جدول امتیازات"
        @click="onClickLeaderboard"
      >
        <Trophy :size="26" :stroke-width="2.5" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { Gamepad2, Trophy } from 'lucide-vue-next'
import FancyButton from '~/components/FancyButton.vue'
import energyIcon from '~/assets/images/energy.svg'

defineProps({
  onClickPlay: { type: Function, required: true },
  onClickLeaderboard: { type: Function, required: true },
})

const promotedTours = [
  { id: '1', title: 'چالش هفتگی', meta: '۱۰۰۰ سکه جایزه', prize: '۱٬۰۰۰ سکه', badge: 'داغ' },
  { id: '2', title: 'تورنمنت ویژه', meta: 'تا فردا', prize: '۵٬۰۰۰ سکه', badge: 'پرومو' },
  { id: '3', title: 'مسابقه شبانه', meta: '۲۲:۰۰', prize: '۲٬۵۰۰ سکه', badge: 'جدید' },
  { id: '4', title: 'جام آخر هفته', meta: 'جمعه ۲۲:۰۰', prize: '۱۰٬۰۰۰ سکه', badge: 'ویژه' },
  { id: '5', title: 'سریع و دقیق', meta: '۵ سوال', prize: '۵۰۰ سکه', badge: 'سریع' },
]

const GAP = 8
const carouselViewportRef = ref(null)
const realCount = promotedTours.length
/** Infinite list: [clone last, ...original, clone first]. scrollIndex 1..realCount = real items; 0 and realCount+1 are clones. */
const carouselItems = computed(() => {
  const last = { ...promotedTours[realCount - 1], carouselKey: 'clone-last' }
  const first = { ...promotedTours[0], carouselKey: 'clone-first' }
  return [last, ...promotedTours.map((t) => ({ ...t, carouselKey: t.id })), first]
})
const totalSlides = realCount + 2
const scrollIndex = ref(1)
const viewportWidth = ref(0)
let resizeObserver = null
let isJumping = false

const canScrollPrev = computed(() => true)
const canScrollNext = computed(() => true)

const carouselVars = computed(() => {
  const w = viewportWidth.value
  if (!w) return {}
  const itemWidth = Math.round(w * 0.7)
  const padding = Math.round((w - itemWidth) / 2)
  return {
    '--carousel-item-width': `${itemWidth}px`,
    '--carousel-padding': `${padding}px`,
  }
})

function getItemWidth(el) {
  return el ? el.offsetWidth * 0.7 : 0
}

function scrollPrev() {
  if (!carouselViewportRef.value) return
  scrollIndex.value = Math.max(0, scrollIndex.value - 1)
  scrollToIndex(scrollIndex.value)
}

function scrollNext() {
  if (!carouselViewportRef.value) return
  scrollIndex.value = Math.min(totalSlides - 1, scrollIndex.value + 1)
  scrollToIndex(scrollIndex.value)
}

function scrollToIndex(index) {
  const el = carouselViewportRef.value
  if (!el) return
  const itemWidth = getItemWidth(el)
  const left = index * (itemWidth + GAP)
  el.scrollTo({ left: Math.max(0, left), behavior: 'smooth' })
}

function updateScrollIndex() {
  const el = carouselViewportRef.value
  if (!el || totalSlides === 0 || isJumping) return
  const itemWidth = getItemWidth(el)
  const index = Math.round(el.scrollLeft / (itemWidth + GAP))
  const clamped = Math.max(0, Math.min(totalSlides - 1, index))
  scrollIndex.value = clamped
  if (clamped === 0) {
    isJumping = true
    scrollIndex.value = realCount
    el.scrollLeft = realCount * (itemWidth + GAP)
    requestAnimationFrame(() => { isJumping = false })
  } else if (clamped === totalSlides - 1) {
    isJumping = true
    scrollIndex.value = 1
    el.scrollLeft = 1 * (itemWidth + GAP)
    requestAnimationFrame(() => { isJumping = false })
  }
}

function measureViewport() {
  const el = carouselViewportRef.value
  if (el && el.offsetWidth > 0) viewportWidth.value = el.offsetWidth
}

let dragStartX = 0
let scrollStartLeft = 0
let isDragging = false
let touchStarted = false

function onPointerDown(e) {
  const el = carouselViewportRef.value
  if (!el) return
  isDragging = true
  dragStartX = e.clientX ?? e.touches?.[0]?.clientX ?? 0
  scrollStartLeft = el.scrollLeft
  el.style.scrollSnapType = 'none'
  if (e.pointerId !== undefined) {
    el.setPointerCapture(e.pointerId)
  }
  window.addEventListener('pointermove', onPointerMove, { passive: false })
  window.addEventListener('pointerup', onPointerUp, { once: true })
  window.addEventListener('pointercancel', onPointerUp, { once: true })
}

function onPointerMove(e) {
  if (!isDragging) return
  e.preventDefault()
  const el = carouselViewportRef.value
  if (!el) return
  const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0
  const delta = dragStartX - x
  el.scrollLeft = scrollStartLeft + delta
}

function restoreSnap(el) {
  if (el) el.style.scrollSnapType = ''
}

function onPointerUp() {
  isDragging = false
  const el = carouselViewportRef.value
  try {
    if (el) el.releasePointerCapture(-1)
  } catch (_) {}
  window.removeEventListener('pointermove', onPointerMove)
  if (!el) return
  requestAnimationFrame(() => {
    updateScrollIndex()
    const targetLeft = scrollIndex.value * (getItemWidth(el) + GAP)
    el.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' })
    const onScrollEnd = () => {
      el.removeEventListener('scrollend', onScrollEnd)
      clearTimeout(timeoutId)
      restoreSnap(el)
    }
    el.addEventListener('scrollend', onScrollEnd, { once: true })
    const timeoutId = setTimeout(onScrollEnd, 450)
  })
}

function onTouchStart(e) {
  touchStarted = true
  dragStartX = e.touches[0].clientX
  const el = carouselViewportRef.value
  if (el) {
    scrollStartLeft = el.scrollLeft
    el.style.scrollSnapType = 'none'
  }
}

function onTouchMove(e) {
  if (!touchStarted || !carouselViewportRef.value) return
  e.preventDefault()
  const el = carouselViewportRef.value
  const x = e.touches[0].clientX
  const delta = dragStartX - x
  el.scrollLeft = scrollStartLeft + delta
}

function onTouchEnd() {
  touchStarted = false
  const el = carouselViewportRef.value
  if (!el) return
  requestAnimationFrame(() => {
    updateScrollIndex()
    const targetLeft = scrollIndex.value * (getItemWidth(el) + GAP)
    el.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' })
    const onScrollEnd = () => {
      el.removeEventListener('scrollend', onScrollEnd)
      clearTimeout(timeoutId)
      el.style.scrollSnapType = ''
    }
    el.addEventListener('scrollend', onScrollEnd, { once: true })
    const timeoutId = setTimeout(onScrollEnd, 400)
  })
}

function onTournamentClick(tour) {
  console.log('Tournament', tour.id)
}

onMounted(() => {
  nextTick(() => {
    const el = carouselViewportRef.value
    if (el) {
      measureViewport()
      resizeObserver = new ResizeObserver(measureViewport)
      resizeObserver.observe(el)
      el.addEventListener('scroll', updateScrollIndex)
      el.addEventListener('pointerdown', onPointerDown)
      const itemWidth = getItemWidth(el)
      el.scrollLeft = 1 * (itemWidth + GAP)
      updateScrollIndex()
    }
  })
})

onBeforeUnmount(() => {
  const el = carouselViewportRef.value
  if (resizeObserver && el) resizeObserver.unobserve(el)
  if (el) {
    el.removeEventListener('scroll', updateScrollIndex)
    el.removeEventListener('pointerdown', onPointerDown)
  }
  window.removeEventListener('pointermove', onPointerMove)
})
</script>

<style scoped>
.home-tab-home {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 0;
  padding: var(--space-2) var(--space-3);
  box-sizing: border-box;
  gap: var(--space-3);
}

.home-middle-section {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 360px;
}

.home-carousel-title {
  margin: 0 0 var(--space-2);
  font-size: var(--text-lg);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  flex-shrink: 0;
}

.home-carousel {
  position: relative;
  width: 100%;
  flex-direction: column;
}

.home-carousel-viewport-wrap {
  position: relative;
  flex: 1;
  min-height: 0;
  display: flex;
  width: 100%;
}

.home-carousel-viewport {
  -webkit-mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
  mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  flex: 1;
  min-width: 0;
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  cursor: grab;
  touch-action: pan-y;
}

.home-carousel-viewport:active {
  cursor: grabbing;
}

.home-carousel-viewport::-webkit-scrollbar {
  display: none;
}

.home-carousel-container {
  display: flex;
  flex-direction: row;
  gap: 8px;
  padding: 4px 0;
  padding-inline: var(--carousel-padding, 0);
  width: max-content;
}

.home-carousel-item {
  flex: 0 0 var(--carousel-item-width, 70%);
  width: var(--carousel-item-width, 70%);
  scroll-snap-align: center;
  scroll-snap-stop: always;
  min-width: 0;
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.home-carousel-item:not(.home-carousel-item--active) {
  opacity: 0.5;
  transform: scale(0.9);
}

.home-carousel-item--active {
  opacity: 1;
  transform: scale(1);
}

.home-carousel-arrows {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-inline: 8px;
  z-index: 1;
}

.home-carousel-arrow {
  pointer-events: auto;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: var(--radius-full);
  border: 2px solid var(--border-default);
  background: var(--bg-elevated);
  color: var(--text-primary);
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s ease, background 0.2s ease;
}

.home-carousel-arrow:hover:not(:disabled) {
  background: var(--bg-card);
}

.home-carousel-arrow:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.tour-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 152px;
  padding: var(--space-4);
  background: linear-gradient(145deg, var(--bg-card) 0%, var(--bg-elevated) 100%);
  border: 2px solid var(--border-default);
  border-radius: var(--radius-xl);
  cursor: pointer;
}

.tour-card-glow {
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.12) 0%, transparent 50%);
  pointer-events: none;
}

.tour-card-badge {
  position: absolute;
  top: var(--space-2);
  right: var(--space-2);
  padding: var(--space-1) var(--space-2);
  background: var(--color-error);
  color: white;
  font-size: 0.7rem;
  font-weight: var(--font-weight-bold);
  border-radius: var(--radius-sm);
}

.tour-card-prize {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  margin-bottom: var(--space-2);
}

.tour-card-prize-icon {
  font-size: 1.25rem;
}

.tour-card-prize-text {
  font-size: var(--text-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-warning);
}

.tour-card-title {
  margin: 0 0 var(--space-1);
  font-size: var(--text-base);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
}

.tour-card-meta {
  margin: 0 0 var(--space-2);
  font-size: var(--text-sm);
  color: var(--text-muted);
}

.tour-card-cta {
  font-size: var(--text-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
}

.home-bottom-bar {
  flex-shrink: 0;
  display: flex;
  align-items: stretch;
  gap: var(--space-2);
  width: 100%;
  max-width: 320px;
  min-height: 72px;
}

.quick-match-wrap {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: stretch;
}

.quick-match-wrap :deep(.fancy-button) {
  width: 100%;
  min-width: 0;
  min-height: 100%;
  height: 100%;
  border-radius: var(--radius-lg);
}

.leaderboard-cup-btn {
  flex-shrink: 0;
  width: 52px;
  min-height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  border-radius: var(--radius-lg);
  background: var(--color-cta-leaderboard);
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 0 var(--color-cta-leaderboard-dark), 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.leaderboard-cup-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 5px 0 var(--color-cta-leaderboard-dark), 0 3px 12px rgba(0, 0, 0, 0.35);
}

.leaderboard-cup-btn:active {
  transform: translateY(2px);
  box-shadow: 0 2px 0 var(--color-cta-leaderboard-dark), 0 1px 4px rgba(0, 0, 0, 0.3);
}
</style>
