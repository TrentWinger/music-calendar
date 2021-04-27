<template>
  <div id="top">
    <div>
      <label>Which date would you like to see your top 5 songs for?</label>
      <input type="date" v-model="scrobbleDateString" /><br />
    </div>
    <button v-on:click="getScrobbles" class="btn btn-primary">Get Scrobbles!</button><br>
    <button v-if="dateSelected()" v-on:click="saveDay" class="btn btn-success">Save</button>
    <ul id="tracklist">
      <h2>Scrobbles for {{ this.userName }}</h2>
      <li v-for="track in topSongs" :key="track.key">
        <img v-bind:src="track.image[1]['#text']" />
        {{ track.name }} - {{ track.artist["#text"] }} 
        <span class="badge badge-secondary">{{track.count}} plays</span>
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
export default class DayCreation extends Vue {
  $appDB = firebase.firestore();

  private scrobbleDateString = "";
  private scrobbleDateUnixTo = "";
  private scrobbleDateUnixFrom = "";
  private lastFMData: any[] = [];
  private allCategories: any[] = [];
  private userName = "";

  private topSongs: any[] = [];

  readonly $appAuth!: FirebaseAuth;
  private uid = "none";

  getLastFMData(): void {
    if (this.userName != "") {
      axios
        .get(
          `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${this.userName}&to=${this.scrobbleDateUnixTo}&from=${this.scrobbleDateUnixFrom}&limit=200&api_key=e62808226e4e83282f7408fbd3672393&format=json`,
          {}
        )
        .then((response) => {
          console.log(response.data);
          this.lastFMData = [];
          this.lastFMData = response.data.recenttracks.track;
          console.log(this.lastFMData);

          var toparray: any[] = [];

          this.lastFMData.forEach((track) => {
            var duplicateFlag = false;
            //Check to see if the title+artist combo is alreayd in the list
            toparray.forEach(trackObj => {
              //If it is, mark it as a dupe
              if(trackObj.key === track.name+track.artist['#text']){
                trackObj.count = trackObj.count + 1;
                duplicateFlag = true;
              }
            })
            if(!duplicateFlag){
              var newTrackObj = {
                key: track.name+track.artist['#text'],
                name: track.name,
                artist: track.artist,
                image: track.image,
                count: 1
              }
              toparray.push(newTrackObj);
            }
          });
          toparray.sort((a, b) => {
            return a.count - b.count;
          })
          toparray.reverse();
          toparray = toparray.slice(0, 5);
          this.topSongs = toparray;
          console.log(toparray);
        });
    } else {
      console.log("No username?");
    }
  }

  getScrobbles(): void {
    var toUTC = new Date(this.scrobbleDateString);
    //Get the "From Date"
    this.scrobbleDateUnixFrom = String(toUTC.getTime() / 1000);
    //Get the "To Date"
    toUTC.setDate(toUTC.getDate() + 1);
    this.scrobbleDateUnixTo = String(toUTC.getTime() / 1000);
    this.getLastFMData();
  }

  dateSelected(): boolean {
    return this.lastFMData.length !== 0;
  }

  saveDay(): void {
    this.$appDB.collection(`savedDays/${this.uid}/savedScrobbles`).add({
      lastfmName: this.userName,
      date: this.scrobbleDateString,
      scrobbles: this.topSongs
    });
    this.lastFMData.splice(0);
    this.$router.push({ path: "/daycreation" });
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
          }
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

li {
  list-style-type: none;
}
</style>
