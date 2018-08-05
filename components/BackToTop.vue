<template>
<transition name="back-to-top-fade">
  <div class="vue-back-to-top" v-show="visible" @click="backToTop">
    <slot>
      <div class="default">
        <b-icon icon="mdi mdi-arrow-up-bold-circle-outline" size="is-medium"></b-icon>
      </div>
    </slot>
  </div>
</transition>
</template>

<script>
export default {
  name: 'BackToTop',
  props: {
    visibleoffset: {
      type: [String, Number],
      default: 600
    }
  },
  data() {
    return {
      visible: false
    }
  },
  mounted() {
    window.smoothscroll = () => {
      let currentScroll = document.documentElement.scrollTop || document.body.scrollTop
      if (currentScroll > 0) {
        window.requestAnimationFrame(window.smoothscroll)
        window.scrollTo(0, Math.floor(currentScroll - (currentScroll / 5)))
      }
    }
    window.addEventListener('scroll', this.catchScroll)
  },
  destroyed() {
    window.removeEventListener('scroll', this.catchScroll)
  },
  methods: {
    /**
     * Catch window scroll event
     * @return {void}
     */
    catchScroll() {
      this.visible = (window.pageYOffset > parseInt(this.visibleoffset))
    },
    /**
     * Pull screen to top function
     * @return {void}
     */
    backToTop() {
      window.smoothscroll()
    }
  }
}
</script>
<style>
.back-to-top-fade-enter-active,
.back-to-top-fade-leave-active {
  transition: opacity .7s;
}

.back-to-top-fade-enter,
.back-to-top-fade-leave-to {
  opacity: 0;
}

.vue-back-to-top {
  position: fixed;
  z-index: 1000;
  cursor: pointer;
}

.vue-back-to-top .default {
  width: 50px;
  text-align: center;
  line-height: 30px;
  border-radius: 3px;
}
</style>
