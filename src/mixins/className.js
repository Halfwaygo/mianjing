export default{
    
    methods: {

        addClassName(el,name){
            var classVal = el.getAttribute("class");
            classVal = classVal + " ";

            if(classVal.indexOf(name) !== -1) return;
            classVal = classVal.concat(name);
            el.setAttribute("class",classVal );
        },

        removeClassName(el,name){
            var classVal = el.getAttribute("class");
            classVal = " " + classVal;

            classVal = classVal.replace(" " + name,"");
            el.setAttribute("class",classVal );
        },
        
    }
    
    
}
