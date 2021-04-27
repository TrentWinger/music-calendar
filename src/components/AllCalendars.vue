<template>
  <div>
    <h2>All Calendars</h2>
    <li v-for="day in savedDays" :key="day.date">
      <div class="day">
        <h2>{{ day.lastfmName }} - {{ day.date }}</h2>
        <br />
        <hr class="my-4" />

        <img v-bind:src="day.scrobbles[0]['image'][1]['#text']" />
        {{ day.scrobbles[0]["name"] }} -
        {{ day.scrobbles[0]["artist"]["#text"] }}
        <span class="badge badge-secondary"
          >{{ day.scrobbles[0].count }} plays</span
        >
        <br />

        <img v-bind:src="day.scrobbles[1]['image'][1]['#text']" />
        {{ day.scrobbles[1]["name"] }} -
        {{ day.scrobbles[1]["artist"]["#text"] }}
        <span class="badge badge-secondary"
          >{{ day.scrobbles[1].count }} plays</span
        >
        <br />

        <img v-bind:src="day.scrobbles[2]['image'][1]['#text']" />
        {{ day.scrobbles[2]["name"] }} -
        {{ day.scrobbles[2]["artist"]["#text"] }}
        <span class="badge badge-secondary"
          >{{ day.scrobbles[2].count }} plays</span
        >

        <br />

        <img v-bind:src="day.scrobbles[3]['image'][1]['#text']" />
        {{ day.scrobbles[3]["name"] }} -
        {{ day.scrobbles[3]["artist"]["#text"] }}
        <span class="badge badge-secondary"
          >{{ day.scrobbles[3].count }} plays</span
        >
        <br />

        <img v-bind:src="day.scrobbles[4]['image'][1]['#text']" />
        {{ day.scrobbles[4]["name"] }} -
        {{ day.scrobbles[4]["artist"]["#text"] }}
        <span class="badge badge-secondary"
          >{{ day.scrobbles[4].count }} plays</span
        >
      </div>
    </li>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { QuerySnapshot } from "@firebase/firestore-types";
import { QueryDocumentSnapshot } from "@firebase/firestore-types";
import firebase from "firebase/app";
import { FirebaseAuth } from "@firebase/auth-types";

@Component
export default class UserInfo extends Vue {
  $appDB = firebase.firestore();

  lastfmName = "";
  private savedDays: any[] = [];
  private uidArray: string[] = [];

  readonly $appAuth!: FirebaseAuth;

  getAllDays(): void {
    this.uidArray.forEach((userId) => {
      console.log(userId);
      this.$appDB
        .collection(`savedDays/${userId}/savedScrobbles`)
        .orderBy("date")
        .onSnapshot((qs: QuerySnapshot) => {
          qs.forEach((qds: QueryDocumentSnapshot) => {
            console.log(qds.data());
            var queryData = qds.data();
            this.savedDays.push({
              date: queryData.date,
              lastfmName: queryData.lastfmName,
              scrobbles: queryData.scrobbles,
            });
          });
          this.savedDays.sort();
        });
    });
  }

  mounted(): void {
    console.log("Running mounted in AllCalendars");
    this.$appDB.collection(`uids`).onSnapshot((qs: QuerySnapshot) => {
      this.uidArray.splice(0); // remove old data
      qs.forEach((qds: QueryDocumentSnapshot) => {
        var queryData = qds.data();
        this.uidArray.push(queryData.uid);
      });
      this.getAllDays();
    });
  }
}
</script>

<style>
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
