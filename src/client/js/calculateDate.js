const months = ['01','02','03','04',"05","06","07",'08','09','10','11','12'];
function calculateDaysToDate(date2){
    const date1 = getNewDate();
    console.log(date1);
    console.log(date2);
    var time_diff = date2.getTime() - date1.getTime(); 
    console.log("time_diff:")
    console.log(time_diff)
    const daysto= time_diff / (1000 * 3600 * 24); 
    
    if(daysto < 0){return -1}
    
    return daysto;
    
    }
    function getNewDate(){
        let d = new Date();
        let newDate = months[d.getMonth()] + '/' + d.getDate()+ '/' + d.getFullYear();
        const date1 = new Date(newDate);
        return date1;
        }

    export {calculateDaysToDate}