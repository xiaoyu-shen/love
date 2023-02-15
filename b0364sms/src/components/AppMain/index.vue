<template>
  <div class="main">
    <app-link v-show="$route.path !== '/home'"></app-link>
    <router-view></router-view>
  </div>
</template>

<script>
import AppLink from "./AppLink.vue";
export default {
  data() {
    return {};
  },

  components: {
    AppLink,
  },

  methods: {},
};
</script>

<style scoped>
.main {
  position: absolute;
  top: 50px;
  left: 230px;
  right: 0px;
  bottom: 0px;
  padding: 10px;
  overflow-y: auto;
  background: url(../../assets/bg.jpg) no-repeat center;
}
</style>