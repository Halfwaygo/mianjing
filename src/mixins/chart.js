export default{
    
    activated(){
        const chartInstance = this.$refs.chart;
        setTimeout(()=>{
            chartInstance && chartInstance.resize();
        }, 100);
        
    }
    
}
