<template>
  <div id="top">
    <div>
      <router-link to="/userinfo" replace
        >Didn't properly set username?</router-link
      >
    </div>
    <ul id="tracklist">
      <h2>Saved Days for {{ this.userName }}</h2>

      <!--  Uncomment this to add functionality similar to the last.fm home page
      <li v-for="track in lastFMData.track" :key="track.name">
        <img v-bind:src="track.image[0]['#text']" />
        {{ track.name }} - {{ track.artist["#text"] }}
      </li>
      -->
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
    </ul>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { QuerySnapshot } from "@firebase/firestore-types";
import { QueryDocumentSnapshot } from "@firebase/firestore-types";
import firebase from "firebase/app";
import ApexChart from "vue-apexcharts";
import { FirebaseAuth } from "@firebase/auth-types";
import axios, { AxiosResponse } from "axios";

@Component({ components: { ApexChart } })
export default class HomePage extends Vue {
  $appDB = firebase.firestore();

  private allCategories: any[] = [];
  private lastFMData: any[] = [];
  private savedDays: any[] = [];

  private userName = "";

  readonly $appAuth!: FirebaseAuth;
  private uid = "none";

  getLastFMData(): void {
    if (this.userName != "") {
      axios
        .get(
          `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${this.userName}&api_key=e62808226e4e83282f7408fbd3672393&format=json`,
          {}
        )
        .then((response) => {
          this.lastFMData = [];
          this.lastFMData = response.data.recenttracks;
        });
    }
  }

  mounted(): void {
    this.uid = this.$appAuth.currentUser?.uid ?? "none";
    console.log(this.uid);
    this.$appDB
      .collection(`users/${this.uid}/userInfo`)
      .onSnapshot((qs: QuerySnapshot) => {
        this.allCategories.splice(0); // remove old data
        qs.forEach((qds: QueryDocumentSnapshot) => {
          if (qds.exists) {
            const catData = qds.data();
            this.userName = catData.lastfmName;
            console.log(this.userName);
            this.getLastFMData();
          }
        });
      });
    this.$appDB
      .collection(`savedDays/${this.uid}/savedScrobbles`)
      .orderBy("date")
      .onSnapshot((qs: QuerySnapshot) => {
        this.savedDays.splice(0); // remove old data
        qs.forEach((qds: QueryDocumentSnapshot) => {
          console.log(qds.data());
          var queryData = qds.data();
          this.savedDays.push({
            date: queryData.date,
            lastfmName: queryData.lastfmName,
            scrobbles: queryData.scrobbles,
          });
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

.day {
  display: inline-block;
  border: 2px solid hsl(30, 2%, 38%);
  border-radius: 0.5em;
  padding: 1em;
  margin: 0.6em;
}

input,
select {
  margin-left: 20px;
  margin-bottom: 10px;
}

h2 {
  text-align: center;
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

li {
  list-style-type: none;
}
</style>
