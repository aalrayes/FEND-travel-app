let trips = {};
let d = new Date();
let newDate = d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear();

// Weather Bit API
const weatherbit_API_url ="https://api.weatherbit.io/v2.0/forecast/daily?";
const weatherbit_API_type = ['current','forecast'];
const weatherbit_API_key='&key=ea7555658fe34b60a2c63e087a520673';
const days = '&days=7';
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
  const days = document.getElementById('date').value;
  console.log(city)
  getGeoname(geonames_API_url,city,geonames_API_key)
    .then(function (data) 
    {
      postData('http://localhost:3000/geonames', { 
        latitude: data.geonames[0].lat,
        longitude: data.geonames[0].lng,
        country: data.geonames[0].countryName
      });

      getPixabay(pixabay_API_url,city,pixabay_API_key)
      .then(function(data)
      {
        postData('http://localhost:3000/pixabay', { 
          img_url: data.hits[0].webformatURL
        });

      });
      getWeatherBit(weatherbit_API_url,data.geonames[0].lng,data.geonames[0].lat,days,weatherbit_API_key)
      .then(function(weatherData){
        
        let arrLow =[];
        let arrMax =[];
        let arrDes =[];

        weatherData.data.forEach(day => {
          arrLow.push(day.low_temp);
          arrMax.push(day.max_temp);
          arrDes.push(day.weather.description);
        });

        postData('http://localhost:3000/weatherbit', { 
          low_temp: arrLow,
          max_temp: arrMax,
          description: arrDes
        });
        generateContent()
      })

    })
}
const getWeatherBit = async (url, lng,lat,days,key) => {
  const res = await fetch(url +'&lat='+lat+'&lon='+lng+days+key);
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

//done 
const generateContent = async () => {
  const request = await fetch('http://localhost:3000/load');
  try {
    const projectData = await request.json();
    document.getElementById('results').innerHTML = projectData.country;
  } catch (error) {
    console.log("error", error);
  }
}

export{init}