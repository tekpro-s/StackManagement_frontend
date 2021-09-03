<template>
  <div>
    <table
      border="1"
      class="table table-sm table-bordered table-striped table-hover"
    >
      <thead>
        <tr>
          <th>テンプレート名</th>
          <th>タイトル</th>
          <th>時間（分）</th>
          <th>備考</th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <!-- <template v-for="(value, index) in templates">
        {{ templates[index].title }} -->
      <tbody>
        <tr v-for="(value, index) in contents" :key="index">
          <!-- <td :key="index">
          {{ value.template_id }}
        </td> -->
          <td v-if="templates_active[index]">
            {{ templates_name[index] }}
          </td>
          <td v-else>
            <div v-if="templates_name[index] != null">
              <input type="text" v-model="templates_name[index]" />
            </div>
          </td>

          <td v-if="templates_active[index]">
            {{ value.title }}
          </td>
          <td v-else>
            <input type="text" v-model="value.title" />
          </td>

          <td v-if="templates_active[index]">
            {{ value.time }}
          </td>
          <td v-else>
            <input type="text" v-model="value.time" />
          </td>

          <td v-if="templates_active[index]">
            {{ value.comment }}
          </td>
          <td v-else>
            <input type="text" v-model="value.comment" />
          </td>

          <td v-if="templates_name[index]">
            <div @click="edit(index, value.template_id)">
              <button class="btn btn-sm btn-success">変更する</button>
            </div>
            <div>
              <button @click="doAdd(index)" class="btn btn-primary">+</button>
              <button @click="doDel(index)" class="btn btn-primary">-</button>
            </div>
          </td>

          <td>
            <div v-if="templates_name[index]" @click="del(value.template_id)">
              <button class="btn btn-sm btn-danger">削除する</button>
            </div>
          </td>
        </tr>
      </tbody>
      <!-- </template> -->
    </table>
  </div>
</template>

<script>
import axios from "axios";
export default {
  props: {
    id: Number,
    templates: Array,
    templates_active: Array,
    contents: Array,
    templates_name: Array,
  },
  data() {
    return {
      template_id: null,
      show_all: false,
      api_url: null,
    };
  },
  methods: {
    // テンプレート更新
    edit(index, template_id) {
      console.log("テンプレート更新：" + " " + this.contents[index]);

      for (let i = 0; i < this.contents.length; i++) {
        console.log(this.contents[i].template_id + " " + template_id);
        if (this.contents[i].template_id == template_id) {
          if (!this.templates_active[i]) {
            console.log(this.api_url + "contents/" + this.contents[i].id);

            axios
              .put(this.api_url + "contents/" + this.contents[i].id, {
                title: this.contents[i].title,
                time: this.contents[i].time,
                comment: this.contents[i].comment,
              })
              .then((response) => {
                this.$store.dispatch("changeUserData", {
                  profile: this.profile,
                });
                console.log(response);
              });
          }

          console.log(this.templates_active[i] + " " + i);

          // 配列の場合、setでないと再描画されない
          this.$set(this.templates_active, i, !this.templates_active[i]);
          console.log(this.templates_active);
          console.log(this.templates_active[i] + " " + i);
        }
      }
    },

    // テンプレート一行追加
    doAdd(index) {
      console.log("テンプレート更新：" + " " + this.contents[index]);
      console.log(this.contents[index].id);
      console.log(this.contents[index].user_id);

      let cnt = 0;

      // テンプレートIDが一致するcontentsの数を数える
      for (let i = 0; i < this.contents.length; i++) {
        if (this.contents[i].template_id == this.contents[index].template_id) {
          cnt++;
        }
      }

      console.log(cnt);

      if (cnt < 3) {
        axios
          .post(this.api_url + "contents", {
            template_id: this.contents[index].template_id,
            user_id: this.contents[index].user_id,
            title: "タイトル",
            time: 0,
            comment: "",
          })
          .then(() => {
            this.$router.go({
              path: this.$router.currentRoute.path,
              force: true,
            });
          });
      }
    },
    // テンプレート一行削除
    doDel(index) {
      let cnt = 0;

      // テンプレートIDが一致するcontentsの数を数える
      for (let i = 0; i < this.contents.length; i++) {
        if (this.contents[i].template_id == this.contents[index].template_id) {
          cnt++;
        }
      }

      // テンプレートが2行以上なら、idが最も大きいテンプレートを削除
      if (cnt > 1) {
        // テンプレートid同じでid最大のものを探す
        axios
          .delete(this.api_url + "contents/" + this.contents[index].id)
          .then(() => {
            this.$router.go({
              path: this.$router.currentRoute.path,
              force: true,
            });
          });
      }
    },

    // 積み上げ削除
    del(template_id) {
      console.log(template_id);

      // テンプレートIDが一致するcontentsの数を数える
      for (let i = 0; i < this.contents.length; i++) {
        if (this.contents[i].template_id == template_id) {
          axios
            .delete(this.api_url + "contents/" + this.contents[i].id)
            .then((response) => {
              console.log(response);
            });
        }
      }

      axios
        .delete(this.api_url + "templates/" + template_id)
        .then((response) => {
          console.log(response);
          this.$router.go({
            path: this.$router.currentRoute.path,
            force: true,
          });
        });
    },
  },
  // 画面表示時
  created() {
    // 環境設定ファイルからURL取得
    this.api_url = process.env.VUE_APP_API_BASE_URL;

    // 現在のパスを取得
    console.log(this.$route.path);

    if (this.$route.path === "/profile") {
      console.log(this.$route.path);
      this.profile = true;
    }
  },
  destroyed() {
    window.removeEventListener("beforeunload", this.handler);
  },
};
</script>

<style scoped>
/* .flex {
  display: flex;
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
  border-bottom: solid 1px white;
  border-left: solid 1px white;
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
table {
  width: 100%;
  border: solid 1px #000;
  border-collapse: collapse;
}

table th {
  position: relative;
  text-align: left;
  border: solid 1px #000;
  padding: 10px;
  width: 10%;
}

table th:after {
  display: block;
  content: "";
  width: 30px;
  height: 2px;
  right: 20px;
}

table td {
  text-align: left;
  padding: 10px;
  width: 10%;
  border: solid 1px #000;
  border-collapse: collapse;
}

table td:nth-last-child(1),
table td:nth-last-child(2) {
  width: 0px;
}

input {
  color: black;
}

button {
  color: black;
} */
</style>
