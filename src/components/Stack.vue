<template>
  <div>
    <div id="app"></div>
    <table
      border="1"
      class="table table-sm table-bordered table-striped table-hover"
    >
      <thead>
        <tr>
          <th>日付</th>
          <th>タイトル</th>
          <th>時間（分）</th>
          <th>備考</th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(value, index) in stacks" :key="index">
          <td v-if="active[index]">{{ value.date }}</td>
          <td v-else><input type="text" v-model="stacks[index].date" /></td>

          <td v-if="active[index]">{{ value.title }}</td>
          <td v-else><input type="text" v-model="stacks[index].title" /></td>

          <td v-if="active[index]">{{ value.time }}分</td>
          <td v-else><input type="text" v-model="stacks[index].time" /></td>

          <td v-if="active[index]">{{ value.comment }}</td>
          <td v-else>
            <input type="text" v-model="stacks[index].comment" />
          </td>

          <!-- シェア変更 -->
          <td>
            <div @click="edit(index)">
              <button class="btn btn-sm btn-success">変更する</button>
            </div>
          </td>
          <!-- シェア削除 -->
          <td>
            <div @click="del(index)">
              <button class="btn btn-sm btn-danger">削除する</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";
export default {
  props: {
    id: Number,
    show_all: Boolean,
    stacks: Array,
    active: Array,
  },
  data() {
    return {
      api_url: null,
    };
  },
  methods: {
    // 積み上げ更新
    edit(index) {
      if (!this.active[index]) {
        console.log(this.active[index]);
        console.log(this.api_url + "stacks/" + this.stacks[index].id);
        axios
          .put(this.api_url + "stacks/" + this.stacks[index].id, {
            title: this.stacks[index].title,
            time: this.stacks[index].time,
            comment: this.stacks[index].comment,
            date: this.stacks[index].date,
          })
          .then((response) => {
            // this.$store.dispatch("changeUserData", {
            //   profile: this.profile,
            // });
            console.log(response);
          });
      }
      console.log(this.active[index] + " " + index);
      //this.active[index] = !this.active[index];
      this.$set(this.active, index, !this.active[index]);
      console.log(this.active[index] + " " + index);
    },
    // 積み上げ削除
    del(index) {
      // 自分の積み上げだけ消せるようにする
      if (this.stacks[index].user_id == this.$store.state.user.id) {
        // 確認ダイアログ表示
        var result = window.confirm("積み上げを削除しますか？");

        if (result) {
          axios
            .delete(this.api_url + "stacks/" + this.stacks[index].id)
            .then((response) => {
              console.log(response);
              console.log(
                this.stacks[index].user_id + " " + this.$store.state.user.id
              );
            });
          this.stacks.splice(index, 1);
          this.active.splice(index, 1);
        }
      } else {
        alert("自分の積み上げではありません");
        console.log(
          this.stacks[index].user_id + " " + this.$store.state.user.id
        );
      }
    },
  },
  // 画面表示時
  created() {
    // 環境設定ファイルからURL取得
    this.api_url = process.env.VUE_APP_API_BASE_URL;
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
} */
/* table {
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
} */

/* table th:after {
  display: block;
  content: "";
  width: 30px;
  height: 2px;
  right: 20px;
} */

/* table td {
  text-align: left;
  padding: 10px;
  width: 10%;
  border: solid 1px #000;
  border-collapse: collapse;
}

table td:nth-last-child(1),
table td:nth-last-child(2) {
  width: 0px;
} */
/* 
input {
  color: black;
}

button {
  color: black;
} */
</style>
