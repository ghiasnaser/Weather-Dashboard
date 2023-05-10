const APIKey="537f8a6f1c2847e5c474a3c3f52efc17";
const dropdownEl=document.getElementById("drop");
const barEl=document.getElementById("drpo_bar");
const searchBtnEl=document.getElementById("search");
const cityNameEl=document.getElementById("city-search");
const todayEl=document.getElementById("today");
const five_daysEl=document.getElementById("five_days_weather");
const visitedCitiesListEL=document.getElementById("visited");
const btnEL=document.querySelectorAll("button");
const nextBtnEl=document.getElementById("next");
const prevBtnEl=document.getElementById("previous");
var cities=JSON.parse(localStorage.getItem("visitedCities")) || [];
var cityObj={};
var index=0;
var diff=0;


//----- This function will display all the searched history once we open the application
function displaySavedCities(){
  $(visitedCitiesListEL).html(""); // empty the list of the search history
    // this for loop will add button for each city in the cities array from the local storage
    for (var i=0;i<cities.length;i++){
      $(visitedCitiesListEL).append(`
        <button type="button" class="btn btn-success" id="history${i}" index="${i}" style="display: none;">${cities[i].name} / ${cities[i].state}</button>
        <br>
      `);
      addBtnListener(i); // for each button we will add a listener so we can click on the button to see the weather for that city
    }
  // then we will display the first 4 cities in the array  
  if(cities.length>4){
    for (var j=index; j<(index+4); j++){
      document.getElementById(`history${j}`).style.display="block";
    }
    nextBtnEl.style.display="block"
    index+=4;
  }
  else{
    for(var j=0; j<cities.length; j++){
      document.getElementById(`history${j}`).style.display="block";
    }
  }
}
// ----- this function will dispalay the next 4 cities in the search history
function displayNext(event){
  event.preventDefault();
  if(cities.length>(index+4)){
    for (var i=0; i<cities.length; i++){
      document.getElementById(`history${i}`).style.display="none";
    }
    for (var j=index; j<(index+4); j++){
      document.getElementById(`history${j}`).style.display="block";
    }
    index+=4;
    console.log("index" + index);
    prevBtnEl.style.display="block";
  }
  else{
    for (var i=0; i<cities.length; i++){
      document.getElementById(`history${i}`).style.display="none";
    }
    for (var j=index; j<cities.length; j++){
      document.getElementById(`history${j}`).style.display="block";
    }
    diff=cities.length-index;
    index=cities.length;
    prevBtnEl.style.display="block";
    nextBtnEl.style.display="none"
  }
}

// ----- this function will dispalay the Previous 4 cities in the search history (the newer cities in the search)
function displayPrev(event){
  event.preventDefault();
  if(index>4){
    for (var i=0; i<cities.length; i++){
      document.getElementById(`history${i}`).style.display="none";
    }
    if(diff!=0){
      index-=diff;
    }
    for (var j=index; j>(index-4); j--){
      document.getElementById(`history${j-1}`).style.display="block";
    }
    index-=4;
    nextBtnEl.style.display="block";
  }
  else{
    for (var i=0; i<cities.length; i++){
      document.getElementById(`history${i}`).style.display="none";
    }
    for (var j=index; j>0; j--){
      document.getElementById(`history${j-1}`).style.display="block";
    }
    index=0;
    prevBtnEl.style.display="none";
  }
}
prevBtnEl.addEventListener("click",displayPrev);
nextBtnEl.addEventListener("click",displayNext);

//-------- this function display the city wither once we click on that button with city name
function addBtnListener(id){
    document.getElementById(`history${id}`).addEventListener("click", function(event){
      event.preventDefault();
      getWeather(cities[id]);
    });
}

// ---------- this function will get the latitude and longitude for a city using the city name
function getGeocodingInfo(cityName){
  var url=`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${APIKey}`;
  fetch(url)
  .then (function (Response){
    return Response.json();
  })
  .then(function(data){
    console.log(data);
    if(data.lenght==1){
      cityObj.name=data[0].name;
      cityObj.state=data[0].state;
      cityObj.latitude=data[0].lat;
      cityObj.longitud=data[0].lon;
      addToCities(cityObj);
      getWeather(cityObj);
      cityObj={};
      cityNameEl.value="";
      console.log("Add becuse there is one city");
      console.log(cities);
      console.log(cityObj);
    }
    else if(data.length>1){
      creatStatsList(data);
      dropdownEl.addEventListener("change",function(event){
        event.preventDefault();
        var stateName=dropdownEl.value;
        dropdownEl.style.display="none";
        barEl.style.display="none";
        cityObj={};
        for(var i=0; i<data.length; i++){
          if(data[i].state==stateName){
            console.log("the city I will add is");
            console.log(data[i]);
            cityObj.name=data[i].name;
            cityObj.state=data[i].state;
            cityObj.latitude=data[i].lat;
            cityObj.longitud=data[i].lon;
            addToCities(cityObj);
            getWeather(cityObj);
            cityNameEl.value="";
          }
        }
        data="";
      });
    }
  });
}

// ---- in case the city is exist in mutibel stats this we call this function to make a list of the states so we can choose the right one
function creatStatsList(arr){
  dropdownEl.style.display="block";
  barEl.style.display="block";
  $(dropdownEl).append(`
    <option selected>Please select the state</option>
  `);
  for (var i=0; i<arr.length; i++){
    if(arr[i].country=="US"){
      $(dropdownEl).append(`
        <option value="${arr[i].state}">${arr[i].state}</option>
      `);
    }
  }
}

//---- this function will add a city object to a cities array if that object is not already exist in the array
function addToCities(obj){
  var exist=false;
  for (var i=0; i<cities.length; i++){
    if(JSON.stringify(obj)==JSON.stringify(cities[i])){
      exist=true;
      console.log(exist);
    }
  }
  if(!exist){
    cities.push(obj);
    localStorage.setItem("visitedCities",JSON.stringify(cities));
  }
  if(cities.length==1){
   document.getElementById("delete").style.display="block";
  }
  displaySavedCities();
}

// -------- this function will get the weather of a city using a city object that cintain(name,latitude,longitude) of that city
function getWeather(cityObject){
  var city = cityObject.name;
  var state_name = cityObject.state;
  var latitude = cityObject.latitude;
  var longitude = cityObject.longitud;
  var weatherURL=`https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,current,minutely,alerts&appid=${APIKey}&units=imperial`;
  fetch(weatherURL)
  .then(function(response){
    return response.json();
  })
  .then(function(data){
    var Today_date=dayjs.unix(data.daily[0].dt).format('MM/DD/YYYY');
      var max_temp=data.daily[0].temp.max;
      var min_temp=data.daily[0].temp.min;
      var humidity=data.daily[0].humidity;
      var wind=data.daily[0].wind_speed;
      var icon_picture=data.daily[0].weather[0].icon;
      $(todayEl).html("");
      $(five_daysEl).html("");
      $(todayEl).append(`
        <h2>${city} / ${state_name} (${Today_date}) <img id="wicon" src="http://openweathermap.org/img/w/${icon_picture}.png" alt="Weather icon"></h2>
        <p>Temp: High(${max_temp}&#${8457};) / Low (${min_temp}&#${8457};)</p>
        <p>Wind: ${wind} MPH</p>
        <p>Humidty: ${humidity} %</p>`
      );

      for (var n=1;n<6;n++){
        var Today_date=dayjs.unix(data.daily[n].dt).format('MM/DD/YYYY');
        var max_temp=data.daily[n].temp.max;
        var min_temp=data.daily[n].temp.min;
        var humidity=data.daily[n].humidity;
        var wind=data.daily[n].wind_speed;
        var icon_picture=data.daily[n].weather[0].icon;
        
        $(five_daysEl).append(`
        <div class="col">
          <div class="card">
            <div class="card-body">
              <h4 class="card-title">${Today_date}</h4>
              <img id="wicon" src="http://openweathermap.org/img/w/${icon_picture}.png" alt="Weather icon">
              <p class="card-text">Temp: High(${max_temp}&#${8457};) / Low(${min_temp}&#${8457};)</p>
              <p class="card-text">Wind: ${wind} MPH</p>
              <p class="card-text">Humidty: ${humidity} %</p>
            </div>
          </div>
        </div>`
        );
      }
  });
  
}

// ---- this is the function that will start the code when we click on the search button
function search(event){
  event.preventDefault();
  dropdownEl.innerHTML="";
  cityObj={};
  var cityName=cityNameEl.value;
  getGeocodingInfo(cityName);
}

if(cities.length>0){
  displaySavedCities();
  document.getElementById("delete").style.display="block";
}
else{
  document.getElementById("delete").style.display="none";
}

// ---- this is a listener on the (clear history button) which will clear the history search anf refresh the page
document.getElementById("delete").addEventListener("click",function(event){
  event.preventDefault();
  localStorage.removeItem("visitedCities");
  $(visitedCitiesListEL).html("");
  prevBtnEl.style.display="none";
  nextBtnEl.style.display="none";
  document.getElementById("delete").style.display="none";
  window.location.reload();
});
// listener on the search button
searchBtnEl.addEventListener("click",search);
