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
      <header class="navbar header has-shadow mobileNav">
        <div class="container" id="myPageTitle">
          <div class="navbar-brand">
            <div class="centerTextBox navbar-item">
              <p class="has-text-weight-semibold">
                {{ this.$store.state.pageName }}
              </p>
            </div>
          </div>
          <span class="navbar-burger burger" :class="{'is-active': menuIsActive}" @click="toggleMenu()">
              <span></span>
              <span></span>
              <span></span>
            </span>
        </div>
        <div class="navbar-menu" :class="{'is-active': menuIsActive}" id="mobileNavbarMenu" @click="toggleMenu()">
          <div class="navbar-end">

            <hr />

            <li class="navbar-item">
              <ul class="menu-list"><a @click="logout()"><b-icon class="mdi mdi-logout"></b-icon>&nbsp;Logout</a></ul>
            </li>

          </div>
        </div>
      </header>
        <nuxt/>
        <BackToTop :visibleoffset="heightOfBrowser"></BackToTop>
  </aside>

  </div>
</template>

<script>
import Cookie from "js-cookie";
import BackToTop from '~/components/BackToTop'

export default {
 middleware: "crewAuth",
    components: {
    BackToTop
  },
  data() {
    return {
      menuIsActive: false,
      heightOfBrowser: 0
    }
  },
  methods: {
    logout() {
      this.$store.dispatch("logout").then(() => {
        Cookie.set("auth", null);
        this.$axios.setToken(false);
        this.$router.push("/");
      });
    },
      toggleMenu() {
      this.menuIsActive = !this.menuIsActive;
    }
  },
    mounted() {
    this.heightOfBrowser = window.innerHeight/7
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

.navbar-menu {
    display: none;
  }

#logout {
  position: fixed;
  display: inline;
  bottom: 30px;
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
  display: block;
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

@media only screen and (min-width:320px) and (max-width:767px) and (orientation:portrait) {
  html {
    font-size: 1rem;
    overflow-y: scroll;
    background-color: white;
  }
  #myPageTitle {
    font-size: 1.2rem;
    padding: 0;
  }
  .container {
    display: block;
  }

  .myContent {
    width: 100% !important;
  }
  hr {
    margin: 0.2rem;
  }
  #mobileNavbarMenu {
    padding: 0.5rem 0.7rem;
  }
  .mobileNav {
    height: 7%;
  }
}

@media screen and (min-width:320px) and (max-width:767px) and (orientation:landscape) {
  html {
    background-color: white;
    overflow-y: scroll;
  }
  .myContent {
    width: 100% !important;
  }
  #myPageTitle {
    font-size: 1.2rem;
  }
  #mobileNavbarMenu {
    height: 50vh;
    overflow-y: scroll;
    box-shadow: none;
  }
  hr {
    margin: 0.2rem;
  }
}

@media screen and (min-width:768px) and (max-width:1024px) and (orientation:portrait) {
  html {
    background-color: white;
    overflow-y: scroll;
  }
  .column.is-10 {
    flex: auto;
    width: -webkit-fill-available;
  }
}

@media screen and (min-width:768px) and (max-width:1024px) and (orientation:landscape) {
  .column.is-10 {
    flex: auto;
    width: -webkit-fill-available;
  }
}
</style>
