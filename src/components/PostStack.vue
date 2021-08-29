<template>
  <div>
    <div class="left-padding border">
      <p>積み上げ</p>
      <div @click="openModal">
        <button>投稿する</button>
      </div>
    </div>
    <div id="overlay" v-if="show">
      <div id="content">
        <div>
          <label class="template_checkbox">
            テンプレート登録<input type="checkbox" v-model="templateRegist" />
          </label>
          <label>
            テンプレート選択
            <select
              name="template"
              v-model="selected"
              @change="updateValue"
              class="template_select"
            >
              <option
                v-for="(data, index) in templateSelect"
                :key="index"
                v-bind:value="data.data.id"
              >
                {{ data.data.name }}
              </option>
            </select>
          </label>
        </div>
        <br />
        <input class="date" placeholder="日付" v-model="date" />
        <div class="stack" v-for="(data, index) in form" :key="index">
          <input placeholder="タイトル" v-model="data.title" />
          <input placeholder="時間（分）" v-model="data.time" />
          <input placeholder="備考" v-model="data.comment" />
        </div>
        <button @click="doAdd">＋</button>
        <button @click="doDel">-</button>
        <br />
        <button @click="send">投稿する</button>
        <button @click="closeModal">閉じる</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
export default {
  beforeRouteUpdate(to, from, next) {
    next();
    this.getTemplates();
    //this.hoge() // 表示用のデータを更新する処理
  },
  props: {
    stacks: Array,
    active: Array,
  },
  data() {
    return {
      date: this.nowDate(),
      form: [{ title: "", time: "", comment: "" }],
      template: {
        title1: "",
        time1: "",
        comment1: "",
        title2: "",
        time2: "",
        comment2: "",
        title3: "",
        time3: "",
        comment3: "",
      },
      templateRegist: false,
      templateSelect: [],
      selected: "",
      show: false,
      template_id: null,
      api_url: null,
    };
  },
  filters: {
    moment: function (date) {
      return moment(date).format("YYYY/MM/DD HH:mm");
    },
  },
  methods: {
    handler(event) {
      event.returnValue = "Data you've inputted won't be synced";
    },
    // フォームを追加する（３つまで）
    doAdd() {
      if (this.form.length < 3) {
        this.form.push({
          title: "",
          time: "",
          comment: "",
        });
      }
    },
    // フォームを削除する（最低１つまで）
    doDel() {
      if (this.form.length > 1) {
        this.form.pop();
      }
    },
    openModal() {
      this.show = true;
    },
    closeModal() {
      this.show = false;
    },
    async send() {
      var options = {
        position: "top-right",
        duration: 2000,
        fullWidth: true,
        type: "error",
      };

      this.show = false;
      this.template_id = null;
      for (let i = 0; i < this.form.length; i++) {
        console.log(i);
        console.log(this.form);
        if (this.form[i].title === "") {
          this.$toasted.show("積み上げ内容を入力してください", options);
        } else if (this.form[i].time === "") {
          this.$toasted.show("時間（分）を入力してください", options);
        } else {
          // const a = axios
          //   .post(this.api_url + "stacks", {
          //     user_id: this.$store.state.user.id,
          //     title: this.form[i].title,
          //     time: this.form[i].time,
          //     comment: this.form[i].comment,
          //     date: this.date,
          //   })
          //   .then(() => {
          //     this.$emit("getChildStack", {
          //       user_id: this.$store.state.user.id,
          //       title: this.form[i].title,
          //       time: this.form[i].time,
          //       comment: this.form[i].comment,
          //       date: this.date,
          //     });
          //   });
          const stack = await axios.post(this.api_url + "stacks", {
            user_id: this.$store.state.user.id,
            title: this.form[i].title,
            time: this.form[i].time,
            comment: this.form[i].comment,
            date: this.date,
          });
          console.log(stack.data.data);
          this.stacks.unshift(stack.data.data);
          this.active.unshift(true);
          //this.$emit("getChildStack", stack.data.data);
        }
      }

      // テンプレート登録
      console.log(this.templateRegist);
      if (this.templateRegist) {
        axios
          .post(this.api_url + "templates", {
            user_id: this.$store.state.user.id,
            name: this.form[0].title,
          })
          .then((response) => {
            // オートインクリメントしたテンプレートID取得
            console.log(response);
            console.log("template_response:" + response);
            console.log("template_id:" + response.data.data_id);
            this.template_id = response.data.data_id;

            // this.$router.go({
            //   path: this.$router.currentRoute.path,
            //   force: true,
            // });

            for (let i = 0; i < this.form.length; i++) {
              console.log(this.template_id);
              console.log(this.$store.state.user.id);
              console.log(this.form[i].title);
              console.log(this.form[i].time);
              console.log(this.form[i].comment);
              axios
                .post(this.api_url + "contents", {
                  template_id: this.template_id,
                  user_id: this.$store.state.user.id,
                  title: this.form[i].title,
                  time: this.form[i].time,
                  comment: this.form[i].comment,
                })
                .then((response) => {
                  console.log(response);
                  console.log("template_response:" + response);
                  console.log("template_id:" + response.data.template_id);
                });
            }
          });
      }
    },
    // 現在日取得
    nowDate() {
      var today = new Date();
      var y = today.getFullYear();
      var m = ("00" + (today.getMonth() + 1)).slice(-2);
      var d = ("00" + today.getDate()).slice(-2);
      return y + "-" + m + "-" + d;
    },
    // 選択したテンプレートから値を取得
    async updateValue() {
      const template = await axios.get(
        this.api_url + "templates/" + this.selected
      );
      console.log(template);
      console.log(template.data.content);
      // const content = await axios.get(
      //   "http://localhost:10080/api/contents/" + template.data.content.id
      // );

      // フォーム入力削除
      for (let i = 0; i < 3; i++) {
        this.form.pop();
      }

      // テンプレートからフォーム取得
      for (let i = 0; i < template.data.content.length; i++) {
        this.form.push({
          title: template.data.content[i].title,
          time: template.data.content[i].time,
          comment: template.data.content[i].comment,
        });
      }

      // if (template.data.item.title2 != null) {
      //   this.form.push({
      //     title: template.data.item.title2,
      //     time: template.data.item.time2,
      //     comment: template.data.item.comment2,
      //   });
      // }

      // if (template.data.item.title3 != null) {
      //   this.form.push({
      //     title: template.data.item.title3,
      //     time: template.data.item.time3,
      //     comment: template.data.item.comment3,
      //   });
      // }
    },
    // テンプレート名取得
    async getTemplates() {
      let templateSelect = [];
      const templates = await axios.get(this.api_url + "templates");

      for (let i = 0; i < templates.data.data.length; i++) {
        await axios
          .get(this.api_url + "templates/" + templates.data.data[i].id)
          .then((response) => {
            templateSelect.push(response.data);
          });
      }

      console.log(templateSelect);
      this.templateSelect = templateSelect;
      console.log(templateSelect);
    },
  },
  // 画面表示時
  created() {
    // 環境設定ファイルからURL取得
    this.api_url = process.env.VUE_APP_API_BASE_URL;

    // テンプレート名取得
    this.getTemplates();
  },
};
</script>

<style scoped>
.left-padding {
  margin: 20px;
}

.stack {
  margin: 5px;
}

.date {
  border: 1px solid white;
  background-color: #15202b;
  margin-top: 5px;
  margin-bottom: 15px;
  margin-left: 10px;
  border-radius: 10px;
  width: 30%;
  height: 30px;
  color: white;
}

.stack input {
  display: inline-block;
  width: 30%;
  height: 30px;
  margin-top: 5px;
  margin-bottom: 15px;
  margin-left: 10px;
  border-radius: 10px;
  border: 1px solid white;
  background-color: #15202b;
  color: white;
}
.template_checkbox {
  color: black;
}
.template_checkbox input {
  width: 20px;
  height: 20px;
}
.template_select {
  color: black;
  width: 20%;
  height: 30px;
}
button {
  width: 100px;
  text-align: center;
  padding: 8px 0 10px;
  color: #fff;
  background-color: #5419da;
  border-radius: 25px;
  display: inline-block;
  margin: 0 0 0 auto;
}
#overlay {
  z-index: 1;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
#content {
  text-align: center;
  z-index: 2;
  width: 100%;
  padding: 10px;
  background: #fff;
}
</style>