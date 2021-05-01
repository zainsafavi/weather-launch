import React, {useState, useEffect}from 'react';
//import keys from './keys.js';
/*
Basic App
At its most simple, this app must be able to communicate the weather based on a zipcode. The user should be able to 
tell the current weather, hourly predictions for the next two days, and a week-long daily forecast. The user should be able 
to toggle between displaying the hourly and daily weather data.
*/


//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date#parameters
//https://momentjs.com/

function Weather() {
    const API_KEY = "7d8fba3394063628f677441fb3121b79";
    
    console.log(API_KEY);

   
  const [weather, setWeather] = useState(null);

  const [location, setLocation] = useState(false);

  const [hourly, setHourly] = useState(true);  

  const [city, setCity] = useState("");

  const [fetched, setFetched] = useState(false);

  const [coordinates, setCoordinates] = useState([0,0]);

  const [handlecity, setHandlecity] = useState("");

  useEffect ( () => {
    const url2 = new URL("https://api.openweathermap.org/data/2.5/weather");
    url2.searchParams.append("appid", API_KEY);
    url2.searchParams.append("q",city);

    url2.searchParams.append("units", "imperial");

    fetch(url2) 
      .then ((resp2) => {
        return resp2.json();
      })
      .then ((resp2) => {
        if (fetched == false && location == true) {
          setWeather(resp2); 
          setFetched(true);
        }

      }); 



      return () => {setFetched(false)};
  }, [city]);

  useEffect(() => {
    if (!fetched) {
    getLocation();
    }

    console.log("something real quick");
    const url = new URL("https://api.openweathermap.org/data/2.5/onecall");
    url.searchParams.append("appid", API_KEY);
    url.searchParams.append("lat", coordinates[0]);
    url.searchParams.append("lon", coordinates[1]);
    
    url.searchParams.append("exclude", "current,minutely,alerts")

    url.searchParams.append("units", "imperial");

    fetch(url)
      .then((resp) => {
        
        return resp.json();
  
      })
      .then((resp) => {
        // also important to check html error codes
        // 200 means no errors
        
        
        
        if (!fetched && location == false) setWeather(resp);
        
        
        
      });
     return () => {setFetched(false)};
  }, [coordinates]);

  const setCityname = (e) => {
    setWeather(null);
    setLocation(true);
    setCity(handlecity);
    
    e.preventDefault();

    

  }

  const handleChange = (e) => {
    setHandlecity(e.target.value);
    
  }

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      console.log("geo didnt work");
    }

    setFetched(true);
  }
  
  const showPosition = (position) => {
    setCoordinates([position.coords.latitude,position.coords.longitude]);
  }

  const currdisplay = (
    <div> {weather!=null && location == true ? <div> Conditions: {weather.weather[0].main} temperature: {weather.main.temp}</div> : <div> city is DNE </div> }</div>

  );

  const hourlydisplay = ( 
  <div>
    {weather!=null && location == false? weather.hourly.map((hour, i) => <div> {1+i} hours from now: hourly temperature: {hour.temp} conditions: {hour.weather[0].main} </div>) : <div> error retrieving weather </div>}
   </div>)
  ;


  const dailydisplay = (
  <div>
  {weather!=null && location == false ? weather.daily.map((day, i) => <div> {i} days from now: high: {day.temp.max} low: {day.temp.min} </div>) : <div> error retrieving weather </div>}
  </div>
  )
  ;

  const isHourly = () => {
    setHourly(true);
    console.log("printing weather: " + weather);

  }

  const isDaily = () => {
    setHourly(false);

}
//onClick = {setLocation(false)}
//<pre>{JSON.stringify(weather, ["daily"])}</pre>


  return (

    <div style={{ textAlign: "center" }}>
      <form onSubmit = {setCityname} > 
      <input type  ="text" onChange = {handleChange} />  
      <input type = "submit" />
      </form>

      <form >
      <button  type = "submit"> current city  </button> 
      </form>
     
      {location? currdisplay : hourly? hourlydisplay :  dailydisplay}

      <button onClick = {isHourly}>hourly </button> <button onClick = {isDaily}>daily </button>
    </div>
  );
}

export default Weather;