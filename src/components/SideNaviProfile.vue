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
    <PostTemplate
      :templates="templates"
      :templates_active="templates_active"
      :contents="contents"
      :templates_name="templates_name"
    />
  </div>
</template>

<script>
import PostTemplate from "./PostTemplate";

export default {
  props: {
    templates: Array,
    templates_active: Array,
    contents: Array,
    templates_name: Array,
  },
  components: {
    PostTemplate,
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