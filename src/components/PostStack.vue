<template>
  <div class="stack">
    <p>積み上げ</p>
    <div @click="send">
      <button>投稿する</button>
    </div>
    <label>
      テンプレート登録<input type="checkbox" v-model="templateRegist" />
    </label>
    <br />
    <label calss="template">
      テンプレート選択
      <select name="template" v-model="selected" @change="updateValue">
        <option
          v-for="(data, index) in templateSelect"
          :key="index"
          v-bind:value="data.item.id"
        >
          {{ data.item.name }}
        </option>
      </select>
    </label>
    <div class="form">
      <input placeholder="日付" v-model="date" />
      <div v-for="(data, index) in form" :key="index">
        <input placeholder="タイトル" v-model="data.title" />
        <input placeholder="時間（分）" v-model="data.time" />
        <input placeholder="備考" v-model="data.comment" />
      </div>
      <button @click="doAdd">＋</button>
      <button @click="doDel">-</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
export default {
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
    };
  },
  filters: {
    moment: function (date) {
      return moment(date).format("YYYY/MM/DD HH:mm");
    },
  },
  methods: {
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
    send() {
      for (let i = 0; i < this.form.length; i++) {
        console.log(i);
        console.log(this.form);
        if (this.form[i].title === "") {
          alert("積み上げ内容を入力してください");
        } else if (this.form[i].time === "") {
          alert("時間（分）を入力してください");
        } else {
          console.log(this.$store.state.user.id);
          console.log(this.form[i].title);
          console.log(this.form[i].time);
          console.log(this.form[i].comment);
          console.log(this.date);
          axios
            .post("http://localhost:10080/api/stacks", {
              user_id: this.$store.state.user.id,
              title: this.form[i].title,
              time: this.form[i].time,
              comment: this.form[i].comment,
              date: this.date,
              //date: "2021-3-21",
            })
            .then(() => {
              //alert("投稿しました");
              // this.share = "";
              // console.log("this.template.title" + (i + 1));
              // console.log("this.template.title" + (i + 1) + "=" + "asddsa");
              // var a = "this.template.title" + (i + 1) + "=" + "asddsa";
              // eval(a);
              //this.template.title1 = "wer";

              //= this.form[i].title
              this.$router.go({
                path: this.$router.currentRoute.path,
                force: true,
              });
            });
        }
      }
      if (this.templateRegist) {
        if (this.form.length == 1) {
          axios
            .post("http://localhost:10080/api/templates", {
              user_id: this.$store.state.user.id,
              name: this.form[0].title,
              title1: this.form[0].title,
              time1: this.form[0].time,
              comment1: this.form[0].comment,
            })
            .then(() => {
              this.$router.go({
                path: this.$router.currentRoute.path,
                force: true,
              });
            });
        } else if (this.form.length == 2) {
          axios
            .post("http://localhost:10080/api/templates", {
              user_id: this.$store.state.user.id,
              name: this.form[0].title,
              title1: this.form[0].title,
              time1: this.form[0].time,
              comment1: this.form[0].comment,
              title2: this.form[1].title,
              time2: this.form[1].time,
              comment2: this.form[1].comment,
            })
            .then(() => {
              this.$router.go({
                path: this.$router.currentRoute.path,
                force: true,
              });
            });
        } else if (this.form.length == 3) {
          axios
            .post("http://localhost:10080/api/templates", {
              user_id: this.$store.state.user.id,
              name: this.form[0].title,
              title1: this.form[0].title,
              time1: this.form[0].time,
              comment1: this.form[0].comment,
              title2: this.form[1].title,
              time2: this.form[1].time,
              comment2: this.form[1].comment,
              title3: this.form[2].title,
              time3: this.form[2].time,
              comment3: this.form[2].comment,
            })
            .then(() => {
              this.$router.go({
                path: this.$router.currentRoute.path,
                force: true,
              });
            });
        }
      }
    },
    // 現在日取得
    nowDate() {
      var today = new Date();
      today =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      return today;
    },
    // 選択したテンプレートから値を取得
    async updateValue() {
      const template = await axios.get(
        "http://localhost:10080/api/templates/" + this.selected
      );

      for (let i = 0; i < 3; i++) {
        this.form.pop();
      }
      console.log(template);
      console.log(template.data.item);

      this.form.push({
        title: template.data.item.title1,
        time: template.data.item.time1,
        comment: template.data.item.comment1,
      });

      if (template.data.item.title2 != null) {
        this.form.push({
          title: template.data.item.title2,
          time: template.data.item.time2,
          comment: template.data.item.comment2,
        });
      }

      if (template.data.item.title3 != null) {
        this.form.push({
          title: template.data.item.title3,
          time: template.data.item.time3,
          comment: template.data.item.comment3,
        });
      }
    },
    // テンプレート名取得
    async getTemplates() {
      let templateSelect = [];
      const templates = await axios.get("http://localhost:10080/api/templates");

      for (let i = 0; i < templates.data.data.length; i++) {
        await axios
          .get(
            "http://localhost:10080/api/templates/" + templates.data.data[i].id
          )
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
    this.getTemplates();
  },
};
</script>

<style scoped>
.stack {
  margin: 15px;
}
.form input {
  width: 95%;
  height: 30px;
  margin-top: 5px;
  margin-bottom: 15px;
  margin-left: 10px;
  border-radius: 10px;
  border: 1px solid white;
  background-color: #15202b;
  color: white;
}
.template {
  color: black;
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
</style>