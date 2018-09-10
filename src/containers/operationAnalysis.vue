<template>
	<div>
		<page-header />
		<div class="container" style='z-index:3'>
			<router-view></router-view>
		</div>
	</div>
</template>

<script>
	import {mapActions, mapState} from 'vuex';
	import * as C from '../constants/api';
	import * as CONST from '../constants/const';
	import utils from  '../utils/misc';
	import pageHeader from '../components/pageHeader';
	import SecondNav from '../components/secondNav';
	//新增加的
	import addEvent from  '../mixins/addEvent';
	import className from  '../mixins/className';

	export default {
		name: 'operationAnalysis',
		mixins: [addEvent,className],
		filters: {},

		components: {
		    pageHeader, SecondNav
		},

		data(){
			return {
				
            }
		},
		watch: {
			
		},

		beforeMount(){
			//this.getApps({});
			this.AppId = this.appid;
		},

		computed: {
			...mapState({
                date: ({root}) => root.date,
                AppType: ({root}) => root.AppType,
                caliberId: ({root}) => root.caliberId,
                appid: ({root}) => root.appid,
                appIdArr: ({course}) => course.allApps,
            }),
		},
		mounted() {

        },


		methods: {
			
			...mapActions(["showPageLoading", "hidePageLoading", ]),
		},
	};

</script>

<style lang='less'>
</style>

