<template>
  <div class="headbar">
    <nav class="headbar__nav">
      <router-link :to="{ name: 'ChooseNFT' }">
        <img src="@/assets/logo.jpg">
      </router-link>
    </nav>
    <div class="headbar__acc">
      <div class="headbar__acc-info">
        <!-- <span>Balance:</span> <b>{{ accBalance }}</b> -->
      </div>
      <button
        class="main-btn main-btn--exit"
        @click="disconnect"
      >Logout</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

const getTezosWallet = computed({
  get() {
    return store.getters["getTezosWalletInstance"];
  },
});

const disconnect = () => {
  console.log(getTezosWallet, "getTezosWallet");
  getTezosWallet.value.client.destroy();
  store.commit("setWalletInstance", undefined);
  store.commit("setUserAddress", "");

  router.push({ name: "LoginView" });
};
</script>

<style lang="scss">
.headbar__acc {
  display: flex;
  align-items: center;
}

.headbar__acc-info {
  display: flex;
  align-items: center;
  color: #fff;
  margin-right: 20px;

  span {
    margin-right: 5px;
  }
}

.near-icon {
  margin-left: 5px;
}

.headbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  padding: 0 15px;
  background: #2d0949;
}

.headbar__nav {
  width: 60%;
  margin-right: auto;
}

.headbar__nav a.router-link-exact-active {
  text-decoration: underline;
}

.headbar__nav a.router-link-exact-active:before,
.headbar__nav a.router-link-exact-active:after {
  transform: scale(1);
}
</style>