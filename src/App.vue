<template>
  <div><p>{{a}}</p></div>
</template>
<script>
export default {
  data(){
    return {
      a:1
    }
  },
  created(){
    console.log('created')
  }
}
</script>
<style scoped>
p{
  color: red;
}
</style>
