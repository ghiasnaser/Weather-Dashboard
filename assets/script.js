const APIKey="537f8a6f1c2847e5c474a3c3f52efc17";
const APIKey_daily="c49a6cb97c14282afdca683da085b1f5";
const dropdownEl=document.getElementById("drop");
const barEl=document.getElementById("drpo_bar");
const searchEl=document.getElementById("search");
//const stat_listEl=document.getElementById("state_list");
const cityEl=document.getElementById("city-search");
const menuEl=document.getElementById("dropdownMenuButton");
const todayEl=document.getElementById("today");
const five_daysEl=document.getElementById("five_days_weather");
const visitedCitiesListEL=document.getElementById("visited");
//const weather_symbols=[{name:"sunny",class:"fas fa-sun",style:style="color:rgb(255,200,26)"}];
//var latitude;
//var longitude;
var cities=[];
var set=false;
var cityObj={};
//var city;
//var obj;
//localStorage.removeItem("cities");

if(localStorage.getItem("cities")!=null){
  cities=JSON.parse(localStorage.getItem("cities"));
  console.log(cities);
}
//localStorage.removeItem("cities");
/*cityEl.addEventListener("change",function(){
  stat_listEl.innerHTML="";
  dropdownEl.style.display="none";
  barEl.style.display="none";
});*/


function displayVisitedCities(list){
  $(visitedCitiesListEL).value="";
  /*for (var i=0;i<list.length;i++){
    $(visitedCitiesListEL).append(`
    <a href="#" class="list-group-item list-group-item-action" Index="${i}">${list[i].city} / ${list[i].state}</a>
    <br>
    `);
  }*/

}

function reset() {
  ////console.log("ffffffrest");
  //stats=[];
  //stat_listEl.innerHTML="";
  dropdownEl.innerHTML="";
  todayEl.innerHTML="";
  five_daysEl.innerHTML="";
  dropdownEl.style.display="none";
  barEl.style.display="none";
  cityObj={};
  set=true;
}

////console.log("befor"+cityObj);



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
              ////console.log(data);
              city_name=data[0].name;
              if(data.length>1){
                dropdownEl.style.display="block";
                barEl.style.display="block";
                $(dropdownEl).append(`
                  <option selected>Please select the state</option>
                    `);
                for (var i=0; i<data.length;i++){
                  if(data[i].country=="US"){
                    //stats.push(data[i].state);
                    $(dropdownEl).append(`
                    <option value="${data[i].state}">${data[i].state}</option>
                    `);
                  }
                }
                dropdownEl.addEventListener("change",function(event) {
                  event.preventDefault;
                 // //console.log("p");
                   // //console.log("1");
                    state_name=this.value;
                    dropdownEl.style.display="none";
                    barEl.style.display="none";
                    done=true;
                   // //console.log(state_name);
                    var index
                    for (var j=0;j<data.length;j++){
                      if(data[j].state==state_name){
                        index=j;
                      }
                    }
                    /*cityObj.lat=data[index].lat;
                    cityObj.long =data[index].lon;
                    cityObj.state=state_name;
                    cityObj.city=city_name;*/
                    cityObj={
                      lat:data[index].lat,
                      long: data[index].lon,
                      city: city_name,
                      state:state_name
                    }
                    //console.log(cityObj);
                   // //console.log("lat ="+cityObj.lat);
                    ////console.log("lat ="+cityObj.long);
                    //if (!(cities.includes(cityObj))){
                      //cities.push(cityObj);
                    if(cities.length==0){
                      cities.push(cityObj);
                      localStorage.setItem("cities",JSON.stringify(cities));
                      displayVisitedCities(cities);
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
                          //console.log(cities.length);
                          //console.log(cities);
                          localStorage.setItem("cities",JSON.stringify(cities));
                          displayVisitedCities(cities);
                          console.log("add with non empty array");
                      }
                    }
                   // }
                    //console.log("city object");
                    //console.log(cityObj);
                    display_weather();
                   // return(cityObj);
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
                /*cityObj.lat=data[0].lat;
                cityObj.long =data[0].lon;
                cityObj.state=state_name;
                cityObj.city=city_name;*/
               // if (!cities.includes(cityObj)){
                for (var i=0;i<cities.length;i++){
                  if (JSON.stringify(cities[i])===JSON.stringify(cityObj)){
                    exist=true;
                    
                  }
                }
                if (!exist){
                  cities.push(cityObj);
                    //console.log(cities.length);
                    //console.log(cities);
                    localStorage.setItem("cities",JSON.stringify(cities));
                    displayVisitedCities(cities);

                }
                //}
                display_weather();
                //return(cityObj);
              }
              ////console.log("ggggggg"+cityObj);
             
                return(cityObj)
              
              });
            
            //return(cityObj);         
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
     // //console.log(data);
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
    //reset();
}
function display_weather(){
 // //console.log("diplayed");
 //console.log("city object befor calling the weather")
  //console.log(cityObj);
  get_weather(cityObj);
}
function setname(event){
  event.preventDefault();
 if(set){
    reset();
    set=false;
  }
  
  for (var i=0;i<cities.length;i++){
    //console.log("saved cities are here")
    //console.log(cities[i]);
  }
  var city_name=cityEl.value;
  ////console.log("llll"+cityObj);
  getGeocoding(city_name);
  set=true;
  ////console.log("mmmmmmm"+cityObj);
  /*a.then(function(result){
    //console.log("klklkl");
    //console.log(result);
  });*/  
  
  ////console.log("after"+cityObj);
  
 /* if(cityObj){
    //console.log("inside");
    get_weather(cityObj);
  }*/
  ////console.log("kkkkkkkkkkklllllllllllll  ="+cityObj);
  //get_weather(cityObj);
}
searchEl.addEventListener("click",setname);

//searchEl.addEventListener("click",fetch_function);
/*

function fetch_function(event){
  reset();
  if (cityEl.value){
    event.preventDefault();
///////////////////// get geocoding start
   /* var Geocoding_URL=`http://api.openweathermap.org/geo/1.0/direct?q=${cityEl.value}&limit=5&appid=537f8a6f1c2847e5c474a3c3f52efc17`;
    var state_name
    fetch(Geocoding_URL)
        .then(function (response) {        
            return response.json();
            })
            .then(function(data){
              //obj = data ;
              //console.log(data);
              city=data[0].name;
              ////console.log("lat : "+latitude);
              
              
              if(data.length>1){
                dropdownEl.style.display="block";
                barEl.style.display="block";
                $(dropdownEl).append(`
                  <option selected>Please select the state</option>
                    `);
                for (var i=0; i<data.length;i++){
                  if(data[i].country=="US"){
                    stats.push(data[i].state);
                    $(dropdownEl).append(`
                    <option value="${data[i].state}">${data[i].state}</option>
                    `);
                  }
                }
                dropdownEl.addEventListener("change",function(event) {
                  //event.preventDefault;
                  //event.target;
                  //console.log("p");
                // document.getElementById("item").addEventListener("click",function() {
                    //console.log("1");
                    state_name=this.value;
                    dropdownEl.style.display="none";
                    barEl.style.display="none";
                    //console.log(state_name);
                    var index
                    for (var j=0;j<data.length;j++){
                      if(data[j].state==state_name){
                        index=j;
                        ////console.log(index);
                        ////console.log(index);
                        latitude=data[index].lat;
                        longitude =data[index].lon;
                      }
                    }*/
//////////////////////////////////////////////// get geocoding end
/*
                    var five_days_weatherURL=`https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,current,minutely,alerts&appid=${APIKey}&units=imperial`;
                    fetch(five_days_weatherURL)
                      .then(function(response){
                        return response.json();
                      })
                      .then(function(data){
                          //console.log(data);
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
                  //});
                }
                
              }   


*/




              /*else{
                state_name=data[0].state;
                var index
                    for (var j=0;j<data.length;j++){
                      if(data[j].state==state_name){
                        index=j;
                        ////console.log(index);
                        ////console.log(index);
                        latitude=data[index].lat;
                        longitude =data[index].lon;
                      }
                    }*/

/*


                    var five_days_weatherURL=`https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,current,minutely,alerts&appid=${APIKey}&units=imperial`;
                    fetch(five_days_weatherURL)
                      .then(function(response){
                        return response.json();
                      })
                      .then(function(data){
                          //console.log(data);
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
                  //});
                

              //}
              
            });
          }
          else{
            alert("you have to enter a city name");
          }
}
    /*$(todayEl).append(`
    <h2><i class='fa-sun' style="font-size:36px;color:rgb(255,200,26);"></i></h2>
    <p>Temp: High(187&#${8457};) / Low (80)</p>
    <p>Wind: 100 MPH</p>
    <p>Humidty: 100 %</p>`
    );*/
////console.log(obj[0].name); */
//var weather_URL=`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${APIKey}`;        
////console.log("data are"+data);
































/*function showPopup() {
    var popup = document.getElementById("popup");
    popup.style.display = "block";
    popup.style.position="absolute";
    popup.style.backfaceVisibility="hidden";
    popup.style.background="red";
  }
  
  function submitAnswer() {
    var answers = document.getElementsByName("answer");
    var selectedAnswer;
  
    for (var i = 0; i < answers.length; i++) {
      if (answers[i].checked) {
        selectedAnswer = answers[i].value;
        break;
      }
    }
  
    if (selectedAnswer) {
      alert("You selected: " + selectedAnswer);
      var popup = document.getElementById("popup");
      popup.style.display = "none";
    } else {
      alert("Please select an answer");
    }
  }
*/


    