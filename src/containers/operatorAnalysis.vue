<template>
	    <div>
	    	<div class="card-part">
	        	<div class="chart-box">
	        		<chart-bar class="chart" ref='chartActiveUser' :options='options' :TBLeft="chartTLeft"  style="height:384px"/>
	        	</div>
	        </div>
	        <!-- <div class="card-part card-table mb20">
	        	<dynamic-table tableTitle="运营商明细" :source="source"
	        		    	:propertyLabels="propertyLabels"
	        		    	:pageSize="pageSize"
	        				:total="total"
	        		    	></dynamic-table>
	        		    </div> -->
	        <div class="card-part card-table mb20">
	        	<dynamic-table tableTitle="运营商明细" :source="source"
	        		
    		    	:propertyLabels="propertyLabels"
    		    	:pageSize="pageSize"
    				:total="total"
    		    	></dynamic-table>
    		</div> 
	    </div>
</template>

<script>
	import {mapActions, mapState} from 'vuex';
	import * as C from '../constants/api';
	import * as CONST from "../constants/const";
	import utils from  '../utils/misc';
	import Tab from  '../components/Tab';
	import DynamicTable from  '../components/DynamicTable';
	import ChartBar from '../components/ChartBar';
	import ChartMutiline from '../components/ChartMutiline';

	export default {
		name: 'operatorAnalysis',

		filters: {},

		components: {
		    Tab, ChartBar, ChartMutiline, DynamicTable
		},

		data(){
			return {
		          propertyLabels: [
		            {key: 'serviceprovider', name: '运行商' , sortable: true},
		            {key: 'totalusers', name: '累计用户', sortable: true},
		            {key: 'rate', name: '占比', sortable: true},
		         ],
				pageNo:1,
				pageSize:5,
				//total:3,

				chartTLeft: 15,
            }
		},

		watch: {
			appid: function(newValue){
				this.getTerminalOperator(this.params);
			},
			caliberId: function(newValue){
				this.getTerminalOperator(this.params);
			},
			AppType: function(newValue){
				this.getTerminalOperator(this.params);
			},
			date: function(newValue){
				this.getTerminalOperator(this.params);
			},
		},

		beforeMount(){
			this.getTerminalOperator(this.params);
		},

		computed: {
			total() {
				return this.source.length||0;
			},

			params() {
            	return {
                    suffix: this.appid + '.json',
                    type: this.AppType,
                    //caliberId: this.caliberId,
                    //caliberId: 1,
                };
            },
            //新增下载表格
            operatorDownTableParams() {
            	return {
                    suffix: this.appid + '.json',
                    type: this.AppType,
                   // caliberId: this.caliberId,
                   //caliberId: 1,
                    isDownload :1,
                };
            },
			...mapState({
				appid: ({root}) => root.appid,
				AppType: ({root}) => root.AppType,
            	caliberId: ({root}) => root.caliberId,
				source:({terminalAnalysis}) => terminalAnalysis.operatorList,
				options: ({terminalAnalysis}) => terminalAnalysis.operatorTopTen,
			}),
		},


		methods: {
			
			...mapActions(["showPageLoading", "hidePageLoading", "getTerminalOperator"]),
		},
	};
</script>

<style lang='less'>
</style>

