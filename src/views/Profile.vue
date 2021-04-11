<template>
  <div class="flex">
    <div class="left">
      <SideNaviProfile />
    </div>
    <div class="right">
      <div class="title">
        <p>プロフィール</p>
      </div>
      <div class="profile">
        <div class="flex-profile">
          <p class="profile-name">{{ name }}</p>
          <div @click="edit">
            <button>変更する</button>
          </div>
        </div>
        <p class="text" v-if="active">{{ profile }}</p>
        <input type="text" v-model="profile" v-else />
      </div>
      <Template />
    </div>
  </div>
</template>

<script>
import SideNaviProfile from "../components/SideNaviProfile";
import Template from "../components/Template.vue";
import axios from "axios";

export default {
  data() {
    return {
      // ログイン中のユーザ名とプロフィール表示
      active: true,
      name: this.$store.state.user.name,
      profile: this.$store.state.user.profile,
      api_url: null,
    };
  },
  methods: {
    // プロフィール更新
    edit() {
      if (!this.active) {
        axios
          .put(this.api_url + "user", {
            email: this.$store.state.user.email,
            profile: this.profile,
          })
          .then((response) => {
            this.$store.dispatch("changeUserData", {
              profile: this.profile,
            });
            console.log(response);
          });
      }
      this.active = !this.active;
    },
  },
  components: {
    SideNaviProfile,
    Template,
  },
  mounted() {
    this.api_url = process.env.VUE_APP_API_BASE_URL;
  },
};
</script>

<style scoped>
.left {
  width: 22%;
  height: 100vh;
}
.right {
  width: 78%;
  height: 100vh;
}
.flex {
  display: flex;
}
.profile {
  padding: 20px;
  border-bottom: solid 1px white;
  border-left: 1px solid white;
}
.profile-name {
  font-size: 24px;
}
.title {
  border-bottom: 1px solid white;
  border-left: 1px solid white;
  padding: 15px;
}
.title p {
  font-size: 20px;
  font-weight: bold;
}
.flex-profile {
  display: flex;
  justify-content: space-between;
}
button {
  width: 100px;
  text-align: center;
  padding: 8px 0 10px;
  color: #fff;
  background-color: #5419da;
  border-radius: 25px;
  display: block;
  margin: 0 0 0 auto;
}
input {
  color: black;
}
</style>