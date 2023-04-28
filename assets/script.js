const APIKey="537f8a6f1c2847e5c474a3c3f52efc17";
const APIKey_daily="c49a6cb97c14282afdca683da085b1f5";
const dropdownEl=document.getElementById("drop");
const barEl=document.getElementById("drpo_bar");
const searchEl=document.getElementById("search");
const cityEl=document.getElementById("city-search");
const menuEl=document.getElementById("dropdownMenuButton");
const todayEl=document.getElementById("today");
const five_daysEl=document.getElementById("five_days_weather");
const visitedCitiesListEL=document.getElementById("visited");
const btnEL=document.querySelectorAll("button");
var cities=[];
var set=false;
var cityObj={};
//localStorage.removeItem("cities");
if(localStorage.getItem("cities")!=null){
  cities=JSON.parse(localStorage.getItem("cities"));
  console.log(cities);
}

displaySavedCities();
function displaySavedCities(){
  $(visitedCitiesListEL).value="";
    for (var i=0;i<cities.length;i++){
      $(visitedCitiesListEL).append(`
        <button type="button" class="btn btn-success" id="history${i}" index="${i}">${cities[i].city} / ${cities[i].state}</button>
        <br>
        `);
        var El=document.getElementById("history"+i);
        El.addEventListener("click",function(event){
          event.preventDefault ();
          event.currentTarget;
          var index=El.getAttribute("index");
          console.log("index = "+ El.getAttribute("index"));
          getCityWeather(index);
        });
    }      
 
}
function displayVisitedCities(CityVisited){
  var index;
  for (var i=0;i<cities.length;i++){
    if(JSON.stringify(cities[i])===JSON.stringify(CityVisited)){
      index=i;
    }
  }
    $(visitedCitiesListEL).append(`
    <button type="button" class="btn btn-success" index=${index}">${CityVisited.city} / ${CityVisited.state}</button>
    <br>
    `);
}

function getCityWeather(index) {

  get_weather(cities[index]);
}

function reset() {
  dropdownEl.innerHTML="";
  todayEl.innerHTML="";
  five_daysEl.innerHTML="";
  dropdownEl.style.display="none";
  barEl.style.display="none";
  cityObj={};
  set=true;
}

async function getGeocoding(name){
  
  var Geocoding_URL=`http://api.openweathermap.org/geo/1.0/direct?q=${name}&limit=5&appid=537f8a6f1c2847e5c474a3c3f52efc17`;
  var state_name;
  var city_name;
  var exist=false;
   await fetch(Geocoding_URL)
        .then(function (response) {        
            return response.json();
            })
            .then(function(data){
              city_name=data[0].name;
              if(data.length>1){
                dropdownEl.style.display="block";
                barEl.style.display="block";
                $(dropdownEl).append(`
                  <option selected>Please select the state</option>
                    `);
                for (var i=0; i<data.length;i++){
                  if(data[i].country=="US"){
                    $(dropdownEl).append(`
                    <option value="${data[i].state}">${data[i].state}</option>
                    `);
                  }
                }
                dropdownEl.addEventListener("change",function(event) {
                  event.preventDefault;
                    state_name=this.value;
                    dropdownEl.style.display="none";
                    barEl.style.display="none";
                    done=true;
                    var index
                    for (var j=0;j<data.length;j++){
                      if(data[j].state==state_name){
                        index=j;
                      }
                    }
                    cityObj={
                      lat:data[index].lat,
                      long: data[index].lon,
                      city: city_name,
                      state:state_name
                    }
                    if(cities.length==0){
                      cities.push(cityObj);
                      localStorage.setItem("cities",JSON.stringify(cities));
                      displayVisitedCities(cityObj);
                      console.log("add in the empty situation");
                    }
                    else{
                      for (var i=0;i<cities.length;i++){
                        console.log("again");
                        if (JSON.stringify(cities[i])==JSON.stringify(cityObj)){
                          exist=true;
                        }
                      }
                      if(!exist){
                        cities.push(cityObj);
                          localStorage.setItem("cities",JSON.stringify(cities));
                          displayVisitedCities(cityObj);
                          console.log("add with non empty array");
                      }
                    }
                    display_weather();
                })
              }
              else{
                state_name=data[0].state;
                cityObj={
                  lat:data[0].lat,
                  long: data[0].lon,
                  city: city_name,
                  state:state_name
                }
                for (var i=0;i<cities.length;i++){
                  if (JSON.stringify(cities[i])===JSON.stringify(cityObj)){
                    exist=true;   
                  }
                }
                if (!exist){
                  cities.push(cityObj);
                    localStorage.setItem("cities",JSON.stringify(cities));
                    displayVisitedCities(cityObj);
                }
                display_weather();
              }
                return(cityObj)
              });        
}

async function get_weather(obj){
  var city = obj.city;
  var state_name = obj.state;
  var latitude = obj.lat;
  var longitude = obj.long;
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
function display_weather(){
  get_weather(cityObj);
}
function setname(event){
  event.preventDefault();
 if(set){
    reset();
    set=false;
  }
  
  var city_name=cityEl.value;
  getGeocoding(city_name);
  set=true;
}
searchEl.addEventListener("click",setname);
