<template>
  <div>
    <router-link to="/expenses" replace>Add Expense Details</router-link>
    <h2>Add Expense Category</h2>
    <div id="exp_cat">
      <div>
        <label>Category</label>
        <input type="text" v-model="budgetCategory" /><br />
      </div>
      <div>
        <label>Monthly Budget</label>
        <input type="number" v-model.number="budgetLimit" /><br />
      </div>
      <button type="button" v-on:click="saveCategory">Add Category</button>
    </div>
    <table>
      <tbody>
        <tr>
          <td>Category</td>
          <td>Monthly Limit</td>
        </tr>
        <tr v-for="(z, pos) in allCategories" :key="pos">
          <td>{{ z.name }}</td>
          <td>${{ z.limit.toFixed(2) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { QuerySnapshot } from "@firebase/firestore-types";
import { QueryDocumentSnapshot } from "@firebase/firestore-types";
import firebase from "firebase/app";
import { FirebaseAuth } from "@firebase/auth-types";

@Component
export default class BudgetCategory extends Vue {
  $appDB = firebase.firestore();

  private budgetCategory = "";
  private budgetLimit = 50;
  private allCategories: any[] = [];

  readonly $appAuth!: FirebaseAuth;
  private uid = "none";

  saveCategory(): void {
    this.$appDB
      .collection(`users/${this.uid}/categories`)
      .add({ name: this.budgetCategory, monthlyLimit: this.budgetLimit });
  }

  mounted(): void {
    this.uid = this.$appAuth.currentUser?.uid ?? "none";
    this.$appDB
      .collection(`users/${this.uid}/categories`)
      .orderBy("name") // Sort by category name
      .onSnapshot((qs: QuerySnapshot) => {
        this.allCategories.splice(0); // remove old data
        qs.forEach((qds: QueryDocumentSnapshot) => {
          if (qds.exists) {
            const catData = qds.data();
            this.allCategories.push({
              name: catData.name,
              limit: catData.monthlyLimit,
            });
          }
        });
      });
  }
}
</script>

<style>
#exp_cat {
  display: inline-block;
  border: 2px solid hsl(30, 90%, 50%);
  border-radius: 0.5em;
  padding: 1em;
  margin: 0.6em;
}

input {
  margin-left: 20px;
  margin-bottom: 10px;
}

button {
  margin-bottom: 10px;
}

table {
  border: 1px solid black;
}

tbody {
  width: 100%;
}

tr:first-child {
  font-weight: bold;
}
</style>
