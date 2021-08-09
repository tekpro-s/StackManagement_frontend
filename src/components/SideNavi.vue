<template>
  <div>
    <div class="left-padding border">
      <div class="flex icon-field" @click="$router.push('/home')">
        <font-awesome-icon icon="home" />
        <p>ホーム</p>
      </div>
      <div class="flex icon-field" @click="$router.push('/profile')">
        <font-awesome-icon icon="user" />
        <p>プロフィール</p>
      </div>
      <div class="flex icon-field" @click="$store.dispatch('logout')">
        <font-awesome-icon icon="sign-out-alt" />
        <p>ログアウト</p>
      </div>
    </div>
    <div v-if="profile">
      <PostTemplate />
    </div>
    <div v-else>
      <PostStack />
    </div>
  </div>
</template>

<script>
import PostTemplate from "./PostTemplate";
import PostStack from "./PostStack";

export default {
  components: {
    PostTemplate,
    PostStack,
  },
  data() {
    return {
      profile: false,
    };
  },
  methods: {
    // 画面表示時
    beforeCreate() {
      // 現在のパスを取得
      // console.log(this.$route.path);

      if (this.$route.path === "/profile") {
        console.log(this.$route.path);
        this.profile = true;
      }
    },
  },
};
</script>

<style scoped>
.left-padding {
  margin: 20px;
}
.flex {
  display: flex;
}
.logo {
  width: 100px;
}
.icon-field {
  margin-top: 15px;
  cursor: pointer;
}
.icon {
  width: 25px;
}
.icon-field p {
  font-size: 16px;
  padding-left: 15px;
}
</style>