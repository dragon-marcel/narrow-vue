<template>
<div>
  <transition name="fade">
  <router-view/>
  </transition>
</div>
</template>

<script>

export default {
  name: 'App',
};
</script>
<style scoped>
.fade-enter-active, .fade.leave.active{
  transition: opacity 0.8s;
}
.fade-enter,.fade-leave-to{
  opacity: 0;
}
</style>
