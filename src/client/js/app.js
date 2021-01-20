import {calculateDaysToDate} from './calculateDate'
let trips = [];
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

      getWeatherBit(weatherbit_API_url,data.geonames[0].lng,data.geonames[0].lat,trip_date,daysToDate,weatherbit_API_key)
      .then(function(weatherData){
        let descriptionFromAPI;
        if(daysToDate > 7){
            descriptionFromAPI = "";
        }else{
          descriptionFromAPI = weatherData.data[0].weather.description;
        }

        postData('http://localhost:3000/weatherbit', { 
          low_temp:weatherData.data[0].min_temp,
          max_temp: weatherData.data[0].max_temp,
          description: descriptionFromAPI
        });
        generateContent(city,trip_date,daysToDate);
        
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


const getWeatherBit = async (url, lng,lat,date,daysToDate,key) => {
  let res;
  let dayOfTrip = new Date(date);
  if(daysToDate<=7){
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

// function to generate the ui 
const generateContent = async (city,date,daysToDate) => {

  const request = await fetch('http://localhost:3000/load');
  try {
    const projectData = await request.json();
    // data from project data 
    const country = projectData.country;
    const max_temp = projectData.max_temp;
    const low_temp = projectData.low_temp;
    const description = projectData.description;
    const daysUntilTrip = daysToDate;

    console.log(projectData);

    // refrences to UI
    const title_container = document.getElementsByClassName('trip_title')[0];
    const date_container = document.getElementsByClassName('trip_date')[0];
    const daysToTrip_countainer = document.getElementsByClassName('trip_days_remaining')[0];
    const weather_container = document.getElementsByClassName('trip_weather')[0];
    const image = document.getElementById('img').setAttribute('src',projectData.img_url);
    const trip_container = document.getElementsByClassName('trip')[0];
    trip_container.classList.add('show');
    
    // changing UI
   
    title_container.innerHTML = 'Destination: \n \n'+country+", "+city;
    date_container.innerHTML = 'Date: \n \n'+date;
    daysToTrip_countainer.innerHTML =' Days remaining until your trip \n \n'+daysUntilTrip;
    weather_container.innerHTML ='Typical weather for then: \n \n High:'+max_temp+', Low:'+low_temp+"\n \n"+description;
    
    

  
  } catch (error) {
    console.log("error", error);
  }
}

export{init}