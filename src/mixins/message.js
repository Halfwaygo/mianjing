export default{
    
    methods: {
        
        removeWarning({title = '删除提示', content = ''}){
            return this.$confirm(content, title, {type: 'warning', confirmButtonClass: 'el-button--danger confirm'});
        },
        
        showWarningMessage( message ){
            this.$message({
                message: message,
                type: 'warning'
            });
        },
        
        getAppId(){
            return this.$route.params.appId;
        }
    }
    
    
}
