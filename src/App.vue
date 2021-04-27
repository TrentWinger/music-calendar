<template>
  <div id="app">
    <div class="jumbotron justify-content-center align-items-center" id="intro">
      <h1 class="display-4">Music Calendar</h1>
      <p class="lead">
        A simple app designed to view Last.fm data based on top scrobbles from a day.<br>
        <span class="badge badge-info">Made by Trent Winger</span>
      </p>
      <hr class="my-4" />
      <div class="row">
        <div class="col-sm justify-content-center">
          <button v-if="userLoggedIn()" v-on:click="routeHome" class="btn btn-primary">Home</button>
        </div>
        <div class="col-sm justify-content-center">
          <button v-if="userLoggedIn()" v-on:click="createDay" class="btn btn-primary">Create a Day</button>
        </div>
        <div class="col-sm justify-content-center">
          <button v-if="userLoggedIn()" v-on:click="routeAllCalendars" class="btn btn-primary">All Calendars</button>
          </div>
        <div class="col-sm justify-content-center">
          <button v-if="userLoggedIn()" v-on:click="doLogout" class="btn btn-danger">Logout</button>
          </div>

      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AppLogin from "./AppLogin.vue";
import { FirebaseFirestore } from "@firebase/firestore-types";
import { FirebaseAuth } from "@firebase/auth-types";

@Component({
  components: {
    AppLogin,
  },
})
export default class App extends Vue {
  readonly $appDB!: FirebaseFirestore;
  readonly $appAuth!: FirebaseAuth;

  routeHome(): void {
    this.$router.push("/homepage");
  }
  createDay(): void {
    this.$router.push({ path: "/daycreation" });
  }
  routeAllCalendars(): void {
    this.$router.push({path: "/allCalendars" });
  }

  userLoggedIn(): boolean {
    return this.$appAuth.currentUser?.uid !== undefined;
  }
  doLogout(): void {
    this.$appAuth.signOut();
    this.$router.push("/"); // Go backward in the "history stack"
  }
  // This function is automatically called when
  // the App component is added to the DOM tree
  mounted(): void {
    // Just for debugging, you may delete the following two
    // lines after it is confirmed that this.$appDB is
    // initialized correctly
    console.log("API Key", this.$appDB.app.options_.apiKey);
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 0px;
}
</style>
