import { container } from "webpack";

let trips = {};
const months = ['01','02','03','04',"05","06","07",'08','09','10','11','12'];

// Weather Bit API
const weatherbit_API_url ="https://api.weatherbit.io/v2.0/";
const weatherbit_API_type = ['normals?','forecast/daily?'];
const weatherbit_API_key='&key=ea7555658fe34b60a2c63e087a520673';
// Geonames API
const geonames_API_url ="http://api.geonames.org/searchJSON?name_equals=";
const geonames_API_key="&username=aalrayes100x";
// Pixabay API
const pixabay_API_url = "https://pixabay.com/api/";
const pixabay_API_key = "?key=19924293-20d70f0423878e94f2469f599";


// done 

function init(e) {
  e.preventDefault();
  const city = document.getElementById('input').value;
  const trip_date = document.getElementById('datepicker').value;
  const daysToDate = calculateDaysToDate(new Date(trip_date));

  console.log(city)
  getGeoname(geonames_API_url,city,geonames_API_key)
    .then(function (data) 
    {
      postData('http://localhost:3000/geonames', { 
        latitude: data.geonames[0].lat,
        longitude: data.geonames[0].lng,
        country: data.geonames[0].countryName
      });

      getWeatherBit(weatherbit_API_url,data.geonames[0].lng,data.geonames[0].lat,trip_date,weatherbit_API_key)
      .then(function(weatherData){
        let descriptionFromAPI;
        if(daysToDate > 7){
            descriptionFromAPI = "";
        }else{
          descriptionFromAPI = weatherData.data[0].weather.description;
        }

        postData('http://localhost:3000/weatherbit', { 
          low_temp:weatherData.data[0].low_temp,
          max_temp: weatherData.data[0].max_temp,
          description: descriptionFromAPI
        });
        generateContent(city,trip_date)
      })

      getPixabay(pixabay_API_url,city,pixabay_API_key)
      .then(function(data)
      {
        postData('http://localhost:3000/pixabay', { 
          img_url: data.hits[0].webformatURL
        });

      });

    })
}
const getWeatherBit = async (url, lng,lat,days,key) => {
  let dayOfTrip = new Date(days);
  let res;
  if(calculateDaysToDate(dayOfTrip)<=7){
  res = await fetch(url +weatherbit_API_type[1]+'&lat='+lat+'&lon='+lng+key);
  }else{
    let startDate = '&start_day='+months[dayOfTrip.getMonth()]+"-"+dayOfTrip.getDate();
    let endDate = '&end_day='+months[dayOfTrip.getMonth()]+"-"+dayOfTrip.getDate();
   res = await fetch(url +weatherbit_API_type[0]+'&lat='+lat+'&lon='+lng+startDate+endDate+key);
  }

  try {
    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log("error", error);
  }
}
const getGeoname = async (url, city, key)=>{
  const res = await fetch(url + city +"&maxRows=3" + key);
  try {
    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log("error", error);
  }
}
const getPixabay = async (url, city, key)=>{
  const res = await fetch(url+key+'&q='+city +"&image_type=photo&page=1&per_page=3");
  try {
    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log("error", error);
  }
}
const postData = async (url = '', data = {}) => {
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  try {
    const newData = await response.json();
    return newData;
  } catch (error) {
    console.log("error", error);
  }
}

function getNewDate(){
let d = new Date();
let newDate = months[d.getMonth()] + '/' + d.getDate()+ '/' + d.getFullYear();
const date1 = new Date(newDate);
return date1;
}

function calculateDaysToDate(date2){
const date1 = getNewDate();
console.log(date1);
console.log(date2);
var time_diff = date2.getTime() - date1.getTime(); 
console.log("time_diff:")
console.log(time_diff)
const daysto= time_diff / (1000 * 3600 * 24); 

console.log(daysto);

return daysto;

}

//done 
const generateContent = async (city,date) => {
  const request = await fetch('http://localhost:3000/load');
  try {
    const projectData = await request.json();

    console.log(projectData.max_temp[0])

    // data from project data 
    const country = projectData.country;
    const max_temp = projectData.max_temp;
    const low_temp = projectData.low_temp;
    const description = projectData.description;
    const dateOfTrip = new Date(date);
    const daysUntilTrip = calculateDaysToDate(dateOfTrip);

    // refrences to UI
    const title_container = document.getElementsByClassName('trip_title')[0];
    const date_container = document.getElementsByClassName('trip_date')[0];
    const daysToTrip_countainer = document.getElementsByClassName('trip_days_remaining')[0];
    const weather_container = document.getElementsByClassName('trip_weather')[0];
    const image = document.getElementById('img').setAttribute('src',projectData.img_url);
    
    // changing UI
    title_container.innerHTML = 'Destination: \n \n'+country+", "+city +" on "+date;
    date_container.innerHTML = date;
    daysToTrip_countainer.innerHTML =' Days remaining until your trip \n \n'+daysUntilTrip;
    // weather_container.innerHTML ='Max tempreature:\n \n'+max_temp+'\n \n Lowest Tempreture: \n \n'+low_temp+" \n \n"+description;

    // trip_container.style.display = 'felx';

  
  } catch (error) {
    console.log("error", error);
  }
}

export{init}