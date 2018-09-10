export default{
    
    methods: {
        
        checkStartDate(date){
           
            const nowTime = +new Date;
            const selectedTime = +date;
            const endTime = this.query.endTime;
            return nowTime - selectedTime > 91 * 24 * 3600 * 1000 ||
                nowTime - selectedTime < 24 * 3600 * 1000 ||
                selectedTime - nowTime > 0 ||
                selectedTime - endTime > 0
            
        },
        
        
        checkEndDate(date){
            const nowTime = +new Date;
            const selectedTime = +date;
            const startTime = +this.query.startTime;
            return selectedTime - startTime < 0 || nowTime - selectedTime < 24 * 3600 * 1000 || selectedTime - nowTime > 0;
            
        }
    }
    
    
}
