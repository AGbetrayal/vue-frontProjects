<template>
  <div id="app">
<!--    <img src="./assets/logo.png">-->
<!--    <router-view/>-->
    <router-view/>
    <FooterGuider v-show="$route.meta.showFooter"/>
  </div>
</template>

<script>
  import FooterGuider from "./components/FooterGuider/FooterGuider"
  import {mapActions} from 'vuex'
  export default {
    mounted () {
      // this.$store.dispatch('getAddress')
      this.getAddress()
      this.getUserInfo()
    },

    methods: {
      ...mapActions(['getAddress', 'getUserInfo'])
    },
    components: {
      FooterGuider
    }
  /*  name: 'App'*/
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
/*#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}*/
</style>
