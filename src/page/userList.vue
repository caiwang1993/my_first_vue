<template>
  <div class="fillcontain">
    <headTop></headTop>

  </div>
</template>
<script>
  import headTop from '@/components/headTop'
  export default{
      data(){

      },
    components:{
          headTop
    }
  }

</script>

<style lang="less">
	@import '../style/mixin';
    .table_container{
        padding: 20px;
    }
</style>
