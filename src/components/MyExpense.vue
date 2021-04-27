<template>
  <div id="top">
    <div>
      <router-link to="/category" replace>Add New Category</router-link>
    </div>
    <section>
      <h2>Enter Your Spending Details</h2>
      <div id="spend_details">
        <div>
          <label>Amount</label>
          <input type="number" v-model.number="spendingAmount" /><br />
        </div>
        <div>
          <label>Date</label>
          <input type="date" v-model="spendingDate" /><br />
        </div>
        <div>
          <label>Where</label>
          <input type="text" v-model="spendingPlace" /><br />
        </div>
        <div>
          <label>Category</label>
          <select v-model="spendingCategory">
            <option
              v-for="(c, pos) in allCategories"
              :value="c.name"
              :key="pos"
              >{{ c.name }}</option
            >
          </select>
          <br />
        </div>
        <button type="button" v-on:click="addExpense">Save</button>
      </div>
    </section>
    <section>
      <h2>Expenses</h2>
      <table>
        <tbody>
          <tr>
            <td>Date</td>
            <td>Category</td>
            <td>Place of Purachse</td>
            <td>Amount</td>
          </tr>
          <tr v-for="(z, pos) in allExpenses" :key="pos">
            <td>{{ z.date }}</td>
            <td>{{ z.category }}</td>
            <td>{{ z.where }}</td>
            <td>${{ z.amount }}</td>
          </tr>
        </tbody>
      </table>
    </section>
    <section>
      <h2>Spending Summary</h2>
      <table>
        <tbody>
          <tr>
            <td>Category</td>
            <td>Total Spending</td>
            <td>Budget Limit</td>
            <td>Status</td>
          </tr>
          <tr v-for="(z, pos) in expenseByCategory" :key="pos">
            <td>{{ z.category }}</td>
            <td>${{ z.amount }}</td>
            <td>{{ z.limit }}</td>
            <td>Test</td>
          </tr>
        </tbody>
      </table>
    </section>
    <section>
      <ApexChart
        width="360"
        type="donut"
        :options="{
          labels: ['One', 'Two', 'Three'],
          series: [10, 15, 90],
        }"
      ></ApexChart>
    </section>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { QuerySnapshot } from "@firebase/firestore-types";
import { QueryDocumentSnapshot } from "@firebase/firestore-types";
import firebase from "firebase/app";
import ApexChart from "vue-apexcharts";
import { FirebaseAuth } from "@firebase/auth-types";

const groupedTotal = new Map<string, number>();

@Component({ components: { ApexChart } })
export default class MyExpense extends Vue {
  $appDB = firebase.firestore();

  private spendingAmount = 0;
  private spendingDate = "";
  private spendingPlace = "";
  private spendingCategory = "";
  private allCategories: any[] = [];
  private allExpenses: any[] = [];
  private expenseByCategory: any[] = [];

  readonly $appAuth!: FirebaseAuth;
  private uid = "none";

  addExpense(): void {
    this.$appDB.collection(`users/${this.uid}/expenses`).add({
      amount: this.spendingAmount,
      date: this.spendingDate,
      category: this.spendingCategory,
      where: this.spendingPlace,
    });
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
    this.$appDB
      .collection(`users/${this.uid}/expenses`)
      .orderBy("date") // Sort by category name
      .onSnapshot((qs: QuerySnapshot) => {
        this.allExpenses.splice(0); // remove old data
        qs.forEach((qds: QueryDocumentSnapshot) => {
          if (qds.exists) {
            const expData = qds.data();
            this.allExpenses.push({
              date: expData.date,
              category: expData.category,
              where: expData.where,
              amount: expData.amount,
            });
          }
        });
      });
    this.allExpenses.forEach((ex: any) => {
      const { category, amount } = ex;
      if (groupedTotal.has(category)) {
        // This category has been recorded earlier, get the old total
        const oldTotal = groupedTotal.get(category) as number;
        groupedTotal.set(category, oldTotal + amount);
      } else {
        // This is a new category
        groupedTotal.set(category, amount);
      }
    });
    console.log(groupedTotal);
    this.expenseByCategory.splice(0); // remove old data

    groupedTotal.forEach((spTotal: number, spCat: string) => {
      // locate the this category within the `allCategories` array
      const pos = this.allCategories.findIndex((d: any) => d.name === spCat);
      this.expenseByCategory.push({
        category: spCat,
        amount: spTotal,
        limit: this.allCategories[pos].limit,
      });
    });
  }
}
</script>

<style>
#spend_details {
  display: inline-block;
  border: 2px solid blue;
  border-radius: 0.5em;
  padding: 1em;
  margin: 0.6em;
}

#top {
  display: grid;
  grid-template-columns: 2fr 3fr;
  grid-template-areas: "input summary" "donut expenses";
}
#top > section:nth-child(1) {
  grid-area: input;
}
#top > section:nth-child(2) {
  grid-area: expenses;
}
#top > section:nth-child(3) {
  grid-area: summary;
}
#top > :nth-child(4) {
  grid-area: donut;
}

input,
select {
  margin-left: 20px;
  margin-bottom: 10px;
}

button {
  margin-bottom: 10px;
}

table,
th,
td {
  text-align: center;
  border: 1px solid black;
}
</style>
