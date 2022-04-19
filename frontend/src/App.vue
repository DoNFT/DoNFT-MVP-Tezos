<template>
  <div class="app-page">
    <notifications />

    <!-- Currently problem in that, Phantom wallet disconnecting by himself after 5-10 minutes of login-->
    <div v-if="false" class="loading-container loading-container--app">
      <spinner :size="82" color="#000" />
      <h1 v-if="true">Signing to wallet</h1>
    </div>

    <template v-else>
      <HeadBar v-if="getUserAddress"/>

      <div class="container">
        <router-view />
      </div>
    </template>

  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useStore } from "vuex";

import HeadBar from "@/components/HeadBar/HeadBar.vue";
import Spinner from "@/components/Spinner";

const store = useStore();

const getUserAddress = computed({
  get() {
    return store.getters["getUserAddress"];
  },
});

onMounted(async () => {
  await store.dispatch("setIpfs");
});
</script>

<style lang="scss">
@import "./styles/app.scss";
</style>
