import {
  calculateDaysToDate
} from './calculateDate'
import {
  getNewDate
} from './calculateDate'
const months = ['01', '02', '03', '04', "05", "06", "07", '08', '09', '10', '11', '12'];

// Weather Bit API
const weatherbit_API_url = "https://api.weatherbit.io/v2.0/";
const weatherbit_API_type = ['normals?', 'forecast/daily?'];
const weatherbit_API_key = '&key=ea7555658fe34b60a2c63e087a520673';
// Geonames API
const geonames_API_url = "http://api.geonames.org/searchJSON?name_equals=";
const geonames_API_key = "&username=aalrayes100x";
// Pixabay API
const pixabay_API_url = "https://pixabay.com/api/";
const pixabay_API_key = "?key=19924293-20d70f0423878e94f2469f599";

const loader = document.getElementsByClassName('lds-dual-ring')[0];
const trip_container = document.getElementsByClassName('trip')[0];



function init(e) {
  e.preventDefault();
  const city = document.getElementById('input').value;
  const date = document.getElementById('datepicker').value;
  // splits date into two diffrent dates
  var dateArr = date.split(/[-]/);

  let startDate = dateArr[0];
  let endDate = dateArr[1];

  const daysUntilTrip = calculateDaysToDate(getNewDate(), new Date(startDate));
  console.log(city)

  // here we remove the show class from the trip container if already exists, usefull when re-searching for locations
  if (trip_container.classList.contains('show')) {
    trip_container.classList.remove('show')
  }

  loader.classList.add('showLoader');

  getGeoname(geonames_API_url, city, geonames_API_key).then((data) => {

    // we check if the city name is correct, otherwise alert user
    if (data.geonames.length == 0) {
      loader.classList.remove('showLoader');
      alert('please enter a valid city name');
      return false;
    }

    // here we will be using promise.all() to execute async calls sequentially and make one post call insted of 3;
    let promises = [getWeatherBit(weatherbit_API_url, data.geonames[0].lng, data.geonames[0].lat, startDate, daysUntilTrip, weatherbit_API_key), getPixabay(pixabay_API_url, city, pixabay_API_key)]

    Promise.all(promises)
      .then((results) => {
        console.log(results);
        let description = ''
        // changing description value depending on the number of days until the trip
        if (calculateDaysToDate(getNewDate(), new Date(startDate)) > 7) {
          // here it would be empty because the api for future forecasts doesn't return a description
          description = '';
        } else {
          description = results[0].data[0].weather.description;
        }

        postData('http://localhost:3000/all', {
          latitude: data.geonames[0].lat,
          longitude: data.geonames[0].lng,
          country: data.geonames[0].countryName,
          low_temp: results[0].data[0].min_temp,
          max_temp: results[0].data[0].max_temp,
          description: description,
          img_url: results[1].hits[0].webformatURL
        })
        setTimeout(function () {
          generateContent(city, startDate, endDate, daysUntilTrip)
        }, 500);
      })
  })
}

const getWeatherBit = async (url, lng, lat, date, daysToDate, key) => {
  let res;
  let dayOfTrip = new Date(date);
  if (daysToDate <= 7) {
    res = await fetch(url + weatherbit_API_type[1] + '&lat=' + lat + '&lon=' + lng + key);
  } else {
    let startDate = '&start_day=' + months[dayOfTrip.getMonth()] + "-" + dayOfTrip.getDate();
    let endDate = '&end_day=' + months[dayOfTrip.getMonth()] + "-" + dayOfTrip.getDate();
    res = await fetch(url + weatherbit_API_type[0] + '&lat=' + lat + '&lon=' + lng + startDate + endDate + key);
  }

  try {
    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log("error", error);
  }
}
const getGeoname = async (url, city, key) => {
  const res = await fetch(url + city + "&maxRows=3" + key);
  try {
    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log("error", error);
  }
}
const getPixabay = async (url, city, key) => {
  const res = await fetch(url + key + '&q=' + city + "&image_type=photo&page=1&per_page=3");
  try {
    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log("error", error);
  }
}

const postData = async (url = '', data = {}) => {
  console.log('post data');
  console.log(data);
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

const generateContent = async (city, start_date, end_date, daysUntilTrip) => {

  const request = await fetch('http://localhost:3000/load');
  try {
    const projectData = await request.json();
    // data from project data 
    const country = projectData.country;
    const high_temp = projectData.max_temp;
    const low_temp = projectData.low_temp;
    const description = projectData.description;

    console.log(projectData);

    // refrences to UI
    const title_container = document.getElementsByClassName('trip_title')[0];
    const start_date_container = document.getElementsByClassName('trip_start_date')[0];
    const end_date_container = document.getElementsByClassName('trip_end_date')[0];
    const daysToTrip_countainer = document.getElementsByClassName('trip_days_remaining')[0];
    const duration_countainer = document.getElementsByClassName('trip_duration')[0];
    const high_weather_container = document.getElementsByClassName('high')[0];
    const low_weather_container = document.getElementsByClassName('low')[0];
    const description_container = document.getElementsByClassName('description')[0];
    const image = document.getElementById('img').setAttribute('src', projectData.img_url);
    loader.classList.remove('showLoader');
    trip_container.classList.add('show');

    // changing UI

    title_container.innerHTML =  country + ", " + city;
    start_date_container.innerHTML= 'From \n \n' + start_date;
    end_date_container.innerHTML= 'To \n \n' + end_date;
    daysToTrip_countainer.innerHTML = 'Days remaining \n \n' + daysUntilTrip;
    duration_countainer.innerHTML = 'Trip duration \n \n'+calculateDaysToDate(new Date(start_date), new Date(end_date))
    high_weather_container.innerHTML= 'High \n \n' + high_temp;
    low_weather_container.innerHTML= 'Low \n \n' + low_temp;
    description_container.innerHTML = description;

  } catch (error) {
    console.log("error", error);
  }
}

export {
  init
}