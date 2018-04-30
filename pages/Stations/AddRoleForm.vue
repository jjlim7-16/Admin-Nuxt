<template>
  <form action=''>
    <div class='modal-card' style='width: auto'>
      <header class='modal-card-head'>
        <p class='modal-card-title'>Login</p>
      </header>
      <section class='modal-card-body'>
        <b-field label='Role Name'>
          <b-input
          :value='role'
          placeholder='New Role'
          required>
          </b-input>
        </b-field>
        <b-field label='Capacity' :value='capacity'>
          <b-select placeholder='Select Max. Capacity'>
            <option value='1'>4</option>
            <option value='2'>6</option>
            <option value='3'>8</option>
          </b-select>
        </b-field>
        <b-field class='file'>
          <b-upload v-model='files'>
            <a class='button is-primary'>
              <b-icon icon='upload'></b-icon>
              <span>Click to upload</span>
            </a>
          </b-upload>
          <span class='file-name'
            v-if='files && files.length'>
            {{ files[0].name }}
          </span>
        </b-field>
      </section>

      <footer class='modal-card-foot'>
        <button class='button' type='button' @click='$parent.close()'>Close</button>
        <button class='button is-primary'>Add New Role</button>
      </footer>
    </div>
  </form>
</template>

<script>
export default {
  data () {
    return {
      isComponentModalActive: false,
      formProps: {
        role: 'Pilot',
        capacity: 4
      }
    }
  }
}
</script>
