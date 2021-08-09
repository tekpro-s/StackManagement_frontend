<template>
  <div class="flex">
    <!-- <button v-on:click="doClick">Show!</button> -->
    <div class="left">
      <SideNavi />
    </div>
    <div class="right">
      <div class="title flex">
        <p>ホーム</p>
        <p>{{ msg }}</p>
        <div>
          <label>
            テンプレート選択
            <select @change="updateValue" class="select">
              <option value="false">自分の積み上げを表示</option>
              <option value="true">全ての積み上げを表示</option>
            </select>
          </label>
        </div>
        <!-- <input type="radio" id="tab1" value="1" v-model="isActive" />
        <label for="tab1">自分の積み上げを表示</label>
        <input type="radio" id="tab2" value="2" v-model="isActive" />
        <label for="tab2">全ての積み上げを表示</label> -->
      </div>
      <Stack :show_all="show_all"></Stack>
    </div>
  </div>
</template>

<script>
import SideNavi from "../components/SideNavi";
import Stack from "../components/Stack";
export default {
  data() {
    return {
      show_all: false,
      projectName: null,
      api_url: null,
      path: null,
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
    updateValue() {
      this.show_all = !this.show_all;
    },
  },

  beforeRouteEnter(to, from, next) {
    console.log(from.path);
    //window.confirm(from.path);
    //this.path = from.path;
    next();
  },
  // 画面表示時
  created() {
    var options = {
      position: "top-right",
      duration: 2000,
      fullWidth: true,
      type: "success",
    };

    this.$toasted.show(this.path, options);
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