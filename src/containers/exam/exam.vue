<template>
	<div class="migu">
		<page-header />
		<div class="container" style='z-index:3'>
			<router-view></router-view>
		</div>
	</div>
</template>

<script>
  import pageHeader from '../../components/pageHeader';
  export default {
    name:"examList",
    components:{
    	pageHeader
    }
  }
</script>

<style scoped>

</style>
