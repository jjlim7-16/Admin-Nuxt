<template>
  <div id="app" class="columns">
    <div class="column is-2 is-hidden-touch" id="nav">
      <aside class="sidebar menu is-hidden-touch">
        <img src="~/static/img-whitelogo.png" alt="logo">

        <ul class="menu-list">
          <li id="logout"><a @click="logout()"><b-icon class="mdi mdi-logout"></b-icon>Logout</a></li>
        </ul>
      </aside>
    </div>
  <aside class="column is-10 myContent">
      <header >
        <div class="container" id="myPageTitle">
          <div class="navbar-brand">
            <div class="centerTextBox navbar-item">
              <p class="has-text-weight-semibold">
                {{ this.$store.state.pageName }}
              </p>
            </div>
          </div>
        </div>
      </header>
        <nuxt/>
  </aside>

  </div>
</template>

<script>
import Cookie from "js-cookie";

export default {
  middleware: "crewAuth",
  methods: {
    logout() {
      this.$store.dispatch("logout").then(() => {
        Cookie.set("auth", null);
        this.$axios.setToken(false);
        this.$router.push("/");
      });
    }
  }
};
</script>


<style>
#app {
  margin: 0px;
}

#nav {
  background-color: #565656;
  height: 100vh;
  display: block;
  top: 0;
  left: 0;
}
#logout {
  position: fixed;
  display: inline;
  bottom: 30px;
  /* width: 18.7%; */
  width: 15%;
  text-align: center;
  font-size: 18px;
  color: white;
}

#myPageTitle {
  max-width: 100%;
  height: 100%;
  font-size: 1.6rem;
  padding: 1vh 2.5vw;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.08);
}

.myContent {
  padding: 0;
}

#content {
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  background-color: white;
  height: 80vh;
  margin: 2vw;
  overflow-y: auto;
}

.menu img {
  display: block;
  margin: 20px auto;
  width: 55%;
  height: 55%;
}
.sidebar a {
  color: white;
}
.container {
  float: right;
  display: flex;
  margin-left: 250px;
  margin-right: auto;
  height: 100%;
  width: 1920px;
}
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  background-color: #f8f8f8;
}
*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

#content {
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  background-color: white;
  height: 80vh;
  margin: 2vw;
  overflow-y: auto;
}
</style>
