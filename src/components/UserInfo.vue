<template>
  <div>
    <h2>Let's get started.</h2>
    <hr class="my-4" />
    <h3>What is your Last.fm username? <span class="badge badge-secondary">Don't use Last.fm? Click <a href="https://www.last.fm/home">here</a></span></h3>
    <input type="text" v-model="lastfmName" /><br />
    <button v-on:click="addInfo">Submit</button>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { QuerySnapshot } from "@firebase/firestore-types";
import { QueryDocumentSnapshot } from "@firebase/firestore-types";
import firebase from "firebase/app";
import { FirebaseAuth } from "@firebase/auth-types";

@Component
export default class AllCalendars extends Vue {
  $appDB = firebase.firestore();

  lastfmName = "";

  readonly $appAuth!: FirebaseAuth;
  private uid = "none";

  get noInput(): boolean {
    return this.lastfmName.length === 0;
  }

  addInfo(): void {
    this.$appDB.collection(`users/${this.uid}/userInfo`).add({
      lastfmName: this.lastfmName
    });
    this.$router.push({ path: "/homepage" })
  }
  mounted(): void {
    this.uid = this.$appAuth.currentUser?.uid ?? "none";
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
