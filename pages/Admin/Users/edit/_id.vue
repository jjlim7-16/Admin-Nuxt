<template>
  <section id="content" class="box" style="margin-left: 5px;">

    <b-field label='Roles*' width="410px">
      <div class="block">
        <b-radio v-model="account_type"
                 native-value="Admin"
                  disabled>
          Admin
        </b-radio>
        <b-radio v-model="account_type"
                 native-value="Crew"
                 disabled>
          Crew
        </b-radio>
      </div>

    </b-field>

    <b-field label='Station Name*' width="410px"  v-show="account_type === 'Crew'">
      <b-select placeholder="Select a station"  v-model="account_type_id" disabled>
        <option v-for="crewAccountType in crewAccountTypeList"
                :value="crewAccountType.account_type_id"
                :key="crewAccountType.account_type_id">
          {{crewAccountType.station_name}}
        </option>
      </b-select>
    </b-field>


    <b-field label='Username*' width="410px" :type="errors.has('username') ? 'is-danger': ''"
             :message="errors.has('username') ? errors.first('username') : ''">
      <b-input placeholder='Enter Username' v-model="username" name="username" data-vv-as="'username'"
               v-validate="'required|alpha_spaces'"></b-input>
    </b-field>

    <b-field label='Password*' width="410px"  :type="errors.has('password') ? 'is-danger': ''"
             :message="errors.has('password') ? errors.first('password') : ''">
      <b-input placeholder='Enter Password' v-model="password" name="password" data-vv-as="'password'"
               password-reveal></b-input>
    </b-field>

    <button class="button is-danger" @click="submit()">Submit</button>
  </section>
</template>

<script>
  import axios from 'axios'
  import config from '~/config.js'
  import DataModel from '../../../../models/dataModel.js'


  export default {

    data(){
      return{
        crewAccountTypeList: [],
        username: '',
        password:'',
        account_type:'Admin',
        stationId:'',
        account_type_id:'',
        userList: this.$store.state.userList
      }
    },
    async beforeMount() {
      try {
        let res = await this.$axios.get(`http://localhost:8000/user/${this.$route.params['id']}`)
        this.crewAccountTypeList.station_name = res.data[1]
        this.userList = res.data[0]
        this.username = this.userList.username
        this.account_type_id = this.userList.account_type_id
        this.account_type = this.userList.account_type
        this.stationId = this.userList.station_id
        this.crewAccountType.station_name = this.crewAccountTypeList.station_name


        res = await this.$axios.get(`http://localhost:8000/user/`)

      } catch(err) {
        console.log(err)
      }
    },

    beforeCreate() {
      axios.get(`http://localhost:8000/user/getAccountTypeCrewList/`)
        .then((res) => {
          this.crewAccountTypeList= res.data
          console.log(this.crewAccountTypeList);
          for(var i in this.data){
            if(this.data[i].account_type != 'Admin'){
              for(var a in this.crewAccountTypeList){
                if(this.crewAccountTypeList[a].account_type==this.data[i]){
                  this.data[i].station_name = this.crewAccountTypeList[a].station_name;
                }
              }
            }else{
              this.data[i].station_name = "NULL";
            }
          }
        })
        .catch(() => {
          console.log('FAIL')
        })
      this.$store.commit('setPageTitle', 'Edit User')
    },


    methods:{
      submit(){
        if(this.account_type == 'Admin'){
          this.account_type_id = 1
        }
        let webFormData = new DataModel.Account(this.account_type_id, this.username, this.password)
        console.log(this.account_type_id+this.username+this.password);
        axios.put(`http://localhost:8000/user/`+ this.$route.params['id'], webFormData)
          .then(res => {
            if (res.status === 200) {
              this.$dialog.alert({
                title: 'Edit User',
                message: `User \'${this.username}\' has been successfully edited.`,
                type: 'is-success',
                hasIcon: true,
                icon: 'check-circle',
                iconPack: 'mdi'
              })
              this.$router.go({path: '/Admin/Users', force: true})
            }
          })

          .catch(err => {
            console.log(err)
          })
      }
    },
    updated() {
      console.log(this.stationId)
    }

  }
</script>

