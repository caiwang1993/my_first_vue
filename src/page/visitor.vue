<template>
    <div>
      <headTop></headTop>
      <visitorPie :pieData="pieData"></visitorPie>
    </div>
</template>

<script>
	import headTop from '../components/headTop'
  import visitorPie from '../components/e-charts/visitorPie'
	import {getUserCity} from '@/api/getData'
    export default {
    	data(){
    		return {
    			pieData: {},
    		}
    	},
    	components: {
    		headTop,
        visitorPie
    	},
    	mounted(){
    		this.initData();
    	},
    	methods: {
    		async initData(){
    			try{
    				const res = await getUserCity();
    				if (res.status == 1) {
    					this.pieData = res.user_city;
    				}else{
    					throw new Error(res)
    				}
    			}catch(err){
    				console.log('获取用户分布信息失败',err);
    			}
    		},
    	}
    }
</script>

<style lang="less">
	@import '../style/mixin';

</style>
