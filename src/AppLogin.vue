<template>
  <div id="login">
    <div>
      <div class="row">
        <div class="col-sm">
          <label>Email</label>
          <input
            type="email"
            class="form-control"
            v-model="email"
            placeholder="Enter email"
          /><br />
        </div>
      </div>
      <div class="row">
        <div class="col-sm">
          <label>Password</label>
          <input
            input
            type="password"
            class="form-control"
            v-model="password"
            placeholder="Password"
          /><br />
        </div>
      </div>
    </div>
    <div>
      <button
        :disabled="noInput"
        v-on:click="createAccount"
        class="btn btn-secondary"
      >
        Sign Up
      </button>
      <button
        :disabled="noInput"
        v-on:click="authenticate"
        class="btn btn-secondary"
      >
        Sign In
      </button>
    </div>
    <div>{{ message }}</div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { UserCredential } from "@firebase/auth-types";
import { FirebaseAuth } from "@firebase/auth-types";
import firebase from "firebase/app";

@Component
export default class AppLogin extends Vue {
  $appDB = firebase.firestore();

  email = "";
  password = "";
  message = "";

  readonly $appAuth!: FirebaseAuth;

  get noInput(): boolean {
    return this.email.length === 0 || this.password.length === 0;
  }

  createAccount(): void {
    this.$appAuth
      .createUserWithEmailAndPassword(this.email, this.password)
      .then((u: UserCredential) => {
        this.showMessage(`User create UID ${u.user?.uid}`);
        console.log(u.user?.uid);
        this.$appDB.collection(`uids`).add({
          uid: u.user?.uid,
        });
      })
      .catch((err: any) => {
        this.showMessage(`Unable to create account ${err}`);
      });

    this.$router.push({ path: "/userinfo" });
  }

  authenticate(): void {
    this.$appAuth
      .signInWithEmailAndPassword(this.email, this.password)
      .then((u: UserCredential) => {
        this.showMessage(`Login successful UID ${u.user?.uid}`);
        console.log(u.user?.uid);
      })
      .catch((err: any) => {
        this.showMessage(`Unable to login ${err}`);
      });
    this.$router.push({ path: "/homepage" });
  }

  showMessage(m: string): void {
    this.message = m;
    setTimeout(() => {
      // Auto disappear after 5 seconds
      this.message = "";
    }, 5000);
  }
}
</script>

<style>
#login {
  border-radius: 0.5em;
  padding: 1em;
  margin: 0.6em;
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
