<template>
  <section>
    <img src="img-whitelogo.png" alt="logo" />
    <div id="form" class="columns is-centered section">
      <div class="box column is-5">
        <b-field :type="errors.has('username') ? 'is-danger': ''"
        :message="errors.has('username') ? errors.first('username') : ''">
          <b-input placeholder='Username' v-model='username' name='username' data-vv-as="'Username'"
          v-validate="'required|alpha'"></b-input>
        </b-field>

        <b-field :type="errors.has('password') ? 'is-danger': ''"
        :message="errors.has('password') ? errors.first('password') : ''">
          <b-input type='password' placeholder='Password' v-model='password' name='password' data-vv-as="'Password'"
          v-validate="'required'"></b-input>
        </b-field>

        <button class="button" @click="login()">Login</button>
      </div>
    </div>
  </section>
</template>

<script>
// import Cookie from 'js-cookie'

export default {
  middleware: 'auth',
  layout: 'fullscreen',
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
  //   // async login() {
  //   //   await this.$store.dispatch("api/auth/login", {
  //   //     username: this.username,
  //   //     password: this.password
  //   //   })
  //   //   .then(result => {
  //   //     console.log("result", result)
  //   //     this.$router.push({ path: '/Admin' })
  //   //   })
  //   //   .catch(error => {
  //   //     this.loading = false
  //   //     if (error.response && error.response.data) {
  //   //       // this.alert = {
  //   //       //   type: "error",
  //   //       //   message: error.response.data.message || error.response.status
  //   //       // }
  //   //     }
  //   //   })
  //   // }
    async login() {
      this.error = null
      return this.$auth
        .loginWith('local', {
          data: {
            username: this.username,
            password: this.password
          }
        })
        .catch(e => {
          this.error = e + ''
        })
    }
  }
}
</script>

<style scoped>

img {
  display: block;
  margin: 90px auto;
  width: 18%;
  height: auto;
}

#form {
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
}

.box {
  background-color: #F9F9F9;
  padding: 25px;
}

.field {
  margin-top: 20px;
}

.button {
  width: 100%;
  background-color: #FF4C65;
  color: white;
  font-weight: bold;
  margin: 15px 0;
}

</style>
