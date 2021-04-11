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
      <template v-for="(value, index) in templates">
        <tr :key="`first-${index}`">
          <template v-for="(value1, index_content) in value.content">
            {{ value.content[index_content].title }}
            <td v-if="active[index]" :key="index_content">
              {{ templates[index].content[index_content].title }}
            </td>
          </template>
          <td v-if="active[index]">{{ value.item.title1 }}</td>
          <td v-else>
            <input type="text" v-model="templates[index].item.title1" />
          </td>

          <td v-if="active[index]">{{ value.item.time1 }}分</td>
          <td v-else>
            <input type="text" v-model="templates[index].item.time1" />
          </td>

          <td v-if="active[index]">{{ value.item.comment1 }}</td>
          <td v-else>
            <input type="text" v-model="templates[index].item.comment1" />
          </td>

          <!-- シェア変更 -->
          <td>
            <div @click="edit(index)">
              <button>変更する</button>
            </div>
          </td>
          <!-- シェア削除 -->
          <td>
            <img
              class="icon"
              src="../assets/cross.png"
              @click="del(index)"
              alt
            />
          </td>
        </tr>
        <tr :key="`second-${index}`">
          <td></td>

          <td v-if="active[index]">{{ value.item.title2 }}</td>
          <td v-else>
            <input type="text" v-model="templates[index].item.title2" />
          </td>

          <td v-if="active[index]">{{ value.item.time2 }}分</td>
          <td v-else>
            <input type="text" v-model="templates[index].item.time2" />
          </td>

          <td v-if="active[index]">{{ value.item.comment2 }}</td>
          <td v-else>
            <input type="text" v-model="templates[index].item.comment2" />
          </td>

          <!-- シェア変更 -->
          <td></td>
          <!-- シェア削除 -->
          <td></td>
        </tr>
        <tr :key="`third-${index}`">
          <td></td>

          <td v-if="active[index]">{{ value.item.title3 }}</td>
          <td v-else>
            <input type="text" v-model="templates[index].item.title3" />
          </td>

          <td v-if="active[index]">{{ value.item.time3 }}分</td>
          <td v-else>
            <input type="text" v-model="templates[index].item.time3" />
          </td>

          <td v-if="active[index]">{{ value.item.comment3 }}</td>
          <td v-else>
            <input type="text" v-model="templates[index].item.comment3" />
          </td>

          <!-- シェア変更 -->
          <td></td>
          <!-- シェア削除 -->
          <td></td>
        </tr>
      </template>
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
    };
  },
  methods: {
    // 積み上げ更新
    edit(index) {
      if (!this.active[index]) {
        console.log(this.active[index]);
        console.log(
          "http://localhost:10080/api/templates/" +
            this.templates[index].item.id
        );
        axios
          .put(
            "http://localhost:10080/api/templates/" +
              this.templates[index].item.id,
            {
              name: this.templates[index].item.name,
              title1: this.templates[index].item.title1,
              time1: this.templates[index].item.time1,
              comment1: this.templates[index].item.comment1,
              title2: this.templates[index].item.title2,
              time2: this.templates[index].item.time2,
              comment2: this.templates[index].item.comment2,
              title3: this.templates[index].item.title3,
              time3: this.templates[index].item.time3,
              comment3: this.templates[index].item.comment3,
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
      // 自分のテンプレートだけ消せるようにする
      if (this.templates[index].item.user_id == this.$store.state.user.id) {
        axios
          .delete(
            "http://localhost:10080/api/templates/" +
              this.templates[index].item.id
          )
          .then((response) => {
            console.log(response);
            console.log(
              this.templates[index].item.user_id +
                " " +
                this.$store.state.user.id
            );
            this.$router.go({
              path: this.$router.currentRoute.path,
              force: true,
            });
          });
      } else {
        alert("自分の積み上げではありません");
        console.log(
          this.templates[index].item.user_id + " " + this.$store.state.user.id
        );
      }
    },
    // テンプレート取得
    async getTemplates() {
      let data = [];
      //let data_contents = [];
      let active = [];
      //let template_id = null;
      const templates = await axios.get("http://localhost:10080/api/templates");

      await Promise.all(
        templates.data.data.map((d) => {
          axios
            .get("http://localhost:10080/api/templates/" + d.id)
            .then((response) => {
              data.push(response.data);
              active.push(true);
              console.log("template_id:" + d.id);
            });
        })
      );
      this.templates = data;
      this.active = active;
      // console.log(this.templates);
      // console.log(this.active);
    },
  },
  // 画面表示時
  created() {
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
