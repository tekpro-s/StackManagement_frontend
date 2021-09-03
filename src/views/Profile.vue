<template>
  <div class="flex">
    <div class="left">
      <SideNaviProfile
        :templates="templates"
        :templates_active="templates_active"
        :contents="contents"
        :templates_name="templates_name"
      />
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
      <Template
        :templates="templates"
        :templates_active="templates_active"
        :contents="contents"
        :templates_name="templates_name"
      />
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
      templates: [],
      contents: [],
      templates_active: [],
      templates_name: [],
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
    // テンプレート取得
    async getTemplates() {
      let data_templates = [];
      let data_contents = [];
      let templates_active = [];
      let templates_name = [];
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
            templates_active.push(true);
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
            templates_active.push(true);
          }
        })
      );
      this.templates = data_templates;
      this.contents = data_contents;
      this.templates_active = templates_active;

      await Promise.all(
        contents.data.data.map((d) => {
          console.log(d);
          // ログイン中ユーザのテンプレートの中身のみ表示
          console.log(d.template_id + " " + d.id);
          console.log();
          // console.log(
          //   "テンプレート名:" + " " + this.findTemplate(d.template_id, d.id)
          // );
          templates_name.push(this.findTemplate(d.template_id, d.id));
          console.log(templates_name);
        })
      );

      this.templates_name = templates_name;

      console.log(this.templates);
      console.log(this.active);
      console.log(this.contents);
      console.log(this.templates_name);
    },
    // テンプレート名検索
    findTemplate(template_id, content_id) {
      console.log(template_id);
      console.log(content_id);
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
  },

  components: {
    SideNaviProfile,
    Template,
  },
  mounted() {
    this.api_url = process.env.VUE_APP_API_BASE_URL;
  }, // 画面表示時
  created() {
    // 環境設定ファイルからURL取得
    this.api_url = process.env.VUE_APP_API_BASE_URL;

    console.log(this.api_url + "stacks");
    // テンプレート取得
    this.getTemplates();
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
  border-bottom: solid 1px black;
  border-left: 1px solid black;
}
.profile-name {
  font-size: 24px;
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