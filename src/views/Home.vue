<template>
  <div class="flex">
    {{ stack }}
    <div class="left">
      <SideNavi :stacks="stacks" :active="active" />
    </div>
    <div class="right">
      <div class="title flex">
        <p>ホーム</p>
      </div>
      <Stack :show_all="show_all" :stacks="stacks" :active="active"></Stack>
    </div>
  </div>
</template>

<script>
import SideNavi from "../components/SideNavi";
import Stack from "../components/Stack";
import axios from "axios";
export default {
  data() {
    return {
      show_all: false,
      projectName: null,
      api_url: null,
      path: null,
      stacks: [],
      active: [],
      stack: "",
    };
  },
  components: {
    SideNavi,
    Stack,
  },
  methods: {
    doClick() {
      var options = {
        position: "top-right",
        duration: 2000,
        fullWidth: true,
        type: "success",
      };

      this.$toasted.show("テスト成功！", options);
    },
    // 積み上げ取得
    async getStacks() {
      let data = [];
      let active = [];
      const stacks = await axios.get(this.api_url + "stacks");

      console.log(this.api_url + "stacks");

      await Promise.all(
        stacks.data.data.map((d) => {
          console.log(d);
          // 全件表示ではない場合
          if (!this.show_all) {
            // ログイン中ユーザの積み上げのみ表示
            if (d.user_id == this.$store.state.user.id) {
              data.push(d);
              active.push(true);
            }
            //全件表示
          } else {
            data.push(d);
            active.push(true);
          }
          /*
          axios
            .get("http://localhost:10080/api/stacks/" + d.id)
            .then((response) => {
              if (!this.show_all) {
                console.log(
                  response.data.item.user_id + " " + this.$store.state.user.id
                );
                // ログイン中ユーザのテンプレートのみ表示
                if (response.data.item.user_id == this.$store.state.user.id) {
                  data.push(response.data);
                  active.push(true);
                }
              } else {
                data.push(response.data);
                active.push(true);
              }
            });
            */
        })
      );
      this.stacks = data;
      this.active = active;
      console.log(this.stacks);
      console.log(this.active);
    },
  },
  // 画面表示時
  created() {
    // 環境設定ファイルからURL取得
    this.api_url = process.env.VUE_APP_API_BASE_URL;

    console.log(this.api_url + "stacks");
    // 積み上げ取得
    this.getStacks();
  },
  updateValue() {
    this.show_all = !this.show_all;
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
.flex {
  display: flex;
  justify-content: space-between;
}

.title {
  border-bottom: 1px solid black;
  border-left: 1px solid black;
  padding: 15px;
}
.title p {
  font-size: 20px;
  font-weight: bold;
}
/*
.left-padding {
  margin: 20px;
}
.logo {
  width: 100px;
}
.icon-field {
  margin-top: 15px;
  cursor: pointer;
}
.icon-field p {
  font-size: 16px;
  padding-left: 15px;
}

.share {
  margin: 15px;
}
.share textarea {
  width: 95%;
  height: 120px;
  margin-top: 15px;
  margin-bottom: 15px;
  border-radius: 10px;
  border: 1px solid black;
  background-color: #15202b;
  color: black;
  resize: none;
}
button {
  width: 100px;
  text-align: center;
  padding: 8px 0 10px;
  color: #000;
  background-color: #5419da;
  border-radius: 25px;
  display: block;
  margin: 0 0 0 auto;
}
.header {
  text-align: center;
  margin-top: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid black;
}
.icon {
  width: 25px;
  height: 25px;
}
.detail {
  margin-left: 50px;
}
.message {
  padding: 20px;
  border-bottom: solid 1px black;
  border-left: solid 1px black;
}
.name {
  font-size: 18px;
  font-weight: bold;
  margin-right: 10px;
}
.text {
  margin-top: 10px;
}
.number {
  margin-left: 10px;
  margin-right: 10px;
}

.select {
  color: black;
} */
</style>