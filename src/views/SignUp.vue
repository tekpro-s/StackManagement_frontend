<template>
  <div>
    <HeaderAuth />
    <div class="card">
      <p>新規登録</p>
      <div class="form">
        <input placeholder="ユーザーネーム" type="text" v-model="name" />
        <input placeholder="プロフィール" type="text" v-model="profile" />
        <input placeholder="メールアドレス" type="email" v-model="email" />
        <input placeholder="パスワード" type="password" v-model="password" />
        <button @click="auth">新規登録</button>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderAuth from "../components/HeaderAuth";
import axios from "axios";
export default {
  data() {
    return {
      name: "",
      profile: "",
      email: "",
      password: "",
      api_url: null,
    };
  },
  components: {
    HeaderAuth,
  },
  methods: {
    auth() {
      axios
        .post(this.api_url + "register", {
          name: this.name,
          profile: this.profile,
          email: this.email,
          password: this.password,
        })
        .then((response) => {
          console.log(response);
          this.$router.replace("/");
        })
        .catch((error) => {
          alert(error);
        });
    },
  },
  mounted() {
    this.api_url = process.env.VUE_APP_API_BASE_URL;
  },
};
</script>

<style scoped>
button {
  width: 100px;
  text-align: center;
  padding: 8px 0 10px;
  color: #fff;
  background-color: #5419da;
  border-radius: 25px;
  cursor: pointer;
}
.card {
  margin: 100px auto;
  width: 350px;
  background: #fff;
  border-radius: 5px;
  padding: 20px;
}
.card p {
  color: black;
  font-weight: bold;
  text-align: center;
}
input {
  margin-top: 15px;
  width: 80%;
  border-radius: 10px;
  padding: 10px;
  border: 1px solid black;
  color: black;
}
.form {
  text-align: center;
}
.form button {
  margin-top: 15px;
}
</style>