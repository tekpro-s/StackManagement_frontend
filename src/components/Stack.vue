<template>
  <div>
    <table border="1">
      <tr>
        <th>日付</th>
        <th>タイトル</th>
        <th>時間（分）</th>
        <th>備考</th>
        <th></th>
        <th></th>
      </tr>
      <tr v-for="(value, index) in stacks" :key="index">
        <td v-if="active[index]">{{ value.item.date }}</td>
        <td v-else><input type="text" v-model="stacks[index].item.date" /></td>

        <td v-if="active[index]">{{ value.item.title }}</td>
        <td v-else><input type="text" v-model="stacks[index].item.title" /></td>

        <td v-if="active[index]">{{ value.item.time }}分</td>
        <td v-else><input type="text" v-model="stacks[index].item.time" /></td>

        <td v-if="active[index]">{{ value.item.comment }}</td>
        <td v-else>
          <input type="text" v-model="stacks[index].item.comment" />
        </td>

        <!-- シェア変更 -->
        <td>
          <div @click="edit(index)">
            <button>変更する</button>
          </div>
        </td>
        <!-- シェア削除 -->
        <td>
          <img class="icon" src="../assets/cross.png" @click="del(index)" alt />
        </td>
      </tr>
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
      stacks: [],
    };
  },
  methods: {
    // 積み上げ更新
    edit(index) {
      if (!this.active[index]) {
        console.log(this.active[index]);
        console.log(
          "http://localhost:10080/api/stacks/" + this.stacks[index].item.id
        );
        axios
          .put(
            "http://localhost:10080/api/stacks/" + this.stacks[index].item.id,
            {
              title: this.stacks[index].item.title,
              time: this.stacks[index].item.time,
              comment: this.stacks[index].item.comment,
              date: this.stacks[index].item.date,
            }
          )
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
      if (this.stacks[index].item.user_id == this.$store.state.user.id) {
        axios
          .delete(
            "http://localhost:10080/api/stacks/" + this.stacks[index].item.id
          )
          .then((response) => {
            console.log(response);
            console.log(
              this.stacks[index].item.user_id + " " + this.$store.state.user.id
            );
            this.$router.go({
              path: this.$router.currentRoute.path,
              force: true,
            });
          });
      } else {
        alert("自分の積み上げではありません");
        console.log(
          this.stacks[index].item.user_id + " " + this.$store.state.user.id
        );
      }
    },
    // 積み上げ取得
    async getStacks() {
      let data = [];
      let active = [];
      const stacks = await axios.get("http://localhost:10080/api/stacks");

      await Promise.all(
        stacks.data.data.map((d) => {
          axios
            .get("http://localhost:10080/api/stacks/" + d.id)
            .then((response) => {
              data.push(response.data);
              active.push(true);
            });
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
    this.getStacks();
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