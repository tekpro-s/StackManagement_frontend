<template>
  <div>
    <table border="1">
      <tr>
        <th>テンプレート名</th>
        <th>タイトル</th>
        <th>時間（分）</th>
        <th>備考</th>
        <th></th>
        <th></th>
      </tr>

      <!-- <template v-for="(value, index) in templates">
        {{ templates[index].title }} -->

      <tr v-for="(value, index) in contents" :key="index">
        <!-- <td :key="index">
          {{ value.template_id }}
        </td> -->
        <td v-if="active[index]">
          {{ name[index] }}
        </td>
        <td v-else>
          <div v-if="name[index] != null">
            <input type="text" v-model="name[index]" />
          </div>
        </td>

        <td v-if="active[index]">
          {{ value.title }}
        </td>
        <td v-else>
          <input type="text" v-model="value.title" />
        </td>

        <td v-if="active[index]">
          {{ value.time }}
        </td>
        <td v-else>
          <input type="text" v-model="value.time" />
        </td>

        <td v-if="active[index]">
          {{ value.comment }}
        </td>
        <td v-else>
          <input type="text" v-model="value.comment" />
        </td>

        <td v-if="name[index]">
          <div @click="edit(index, value.template_id)">
            <button>変更する</button>
          </div>
          <div>
            <button @click="doAdd(index)">+</button>
            <button @click="doDel(index)">-</button>
          </div>
        </td>

        <td>
          <div v-if="name[index]" @click="del(value.template_id)">
            <button>削除する</button>
          </div>
        </td>
      </tr>
      <!-- </template> -->
    </table>
  </div>
</template>

<script>
import axios from "axios";
export default {
  props: ["id"],
  data() {
    return {
      active: [],
      templates: [],
      contents: [],
      name: [],
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
          if (!this.active[i]) {
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

          console.log(this.active[i] + " " + i);

          // 配列の場合、setでないと再描画されない
          this.$set(this.active, i, !this.active[i]);
          console.log(this.active);
          console.log(this.active[i] + " " + i);
        }
      }
    },
    // テンプレート取得
    async getTemplates() {
      let data_templates = [];
      let data_contents = [];
      let active = [];
      let name = [];
      //let template_id = null;
      const templates = await axios.get(this.api_url + "templates");
      const contents = await axios.get(this.api_url + "contents");

      await Promise.all(
        templates.data.data.map((d) => {
          console.log(d);
          // ログイン中ユーザのテンプレートのみ表示
          console.log(d.user_id + " " + this.$store.state.user.id);
          if (d.user_id == this.$store.state.user.id) {
            data_templates.push(d);
            active.push(true);
          }
        })
      );

      await Promise.all(
        contents.data.data.map((d) => {
          console.log(d);
          // ログイン中ユーザのテンプレートの中身のみ表示
          console.log(d.user_id + " " + this.$store.state.user.id);
          if (d.user_id == this.$store.state.user.id) {
            data_contents.push(d);
            active.push(true);
          }
        })
      );
      this.templates = data_templates;
      this.contents = data_contents;
      this.active = active;

      await Promise.all(
        contents.data.data.map((d) => {
          console.log(d);
          // ログイン中ユーザのテンプレートの中身のみ表示
          console.log(d.template_id + " " + d.id);
          console.log();
          // console.log(
          //   "テンプレート名:" + " " + this.findTemplate(d.template_id, d.id)
          // );
          name.push(this.findTemplate(d.template_id, d.id));
          console.log(name);
        })
      );

      this.name = name;

      console.log(this.templates);
      console.log(this.active);
      console.log(this.name);
    },
    // テンプレート名検索
    findTemplate(template_id, content_id) {
      let name = null;

      // templates配列の値を全てループで確認
      // 最初に引っかかったテンプレートIDの名前を返す
      console.log(this.templates.length);
      this.templates.find((template) => {
        if (template.id == template_id) {
          console.log(template.name);

          // テンプレート名が確定
          console.log(name);

          let cnt = 0;
          this.contents.find((content) => {
            if (content.template_id == template_id) {
              console.log(
                content.template_id + " " + content.id + " " + content_id
              );
              if (content.id == content_id && cnt == 0) {
                cnt++;
                console.log("一致" + content.id + " " + content_id);
                name = template.name;
                console.log(name);
              } else {
                cnt++;
                console.log(
                  "間違い" + content.id + " " + content_id + " " + cnt
                );
                if (name == null) {
                  name = null;
                }
                console.log(name);
              }
            }

            // return template.id == template_id;
          });

          //break;
        }
      });

      return name;
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
    this.getTemplates();
  },
};
</script>

<style scoped>
.flex {
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
  border: solid 1px #fff;
  border-collapse: collapse;
}

table th {
  position: relative;
  text-align: left;
  border: solid 1px #fff;
  padding: 10px;
  width: 10%;
}

/* table th:after {
  display: block;
  content: "";
  width: 30px;
  height: 2px;
  right: 20px;
} */

table td {
  text-align: left;
  padding: 10px;
  width: 10%;
  border: solid 1px #fff;
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
}
</style>
