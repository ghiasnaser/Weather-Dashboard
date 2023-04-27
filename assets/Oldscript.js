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
//const weather_symbols=[{name:"sunny",class:"fas fa-sun",style:style="color:rgb(255,200,26)"}];
//var latitude;
//var longitude;
var visited_cities=[];//localStorage.getItem("visited_cities");
var set=false;
var city_obj={};
//var city;
//var obj;

/*cityEl.addEventListener("change",function(){
  stat_listEl.innerHTML="";
  dropdownEl.style.display="none";
  barEl.style.display="none";
});*/

function reset() {
  //console.log("ffffffrest");
  //stats=[];
  //stat_listEl.innerHTML="";
  dropdownEl.innerHTML="";
  todayEl.innerHTML="";
  five_daysEl.innerHTML="";
  dropdownEl.style.display="none";
  barEl.style.display="none";
  city_obj={};
 // set=true;
}

//console.log("befor"+city_obj);



async function getGeocoding(name){
  
  var Geocoding_URL=`http://api.openweathermap.org/geo/1.0/direct?q=${name}&limit=5&appid=537f8a6f1c2847e5c474a3c3f52efc17`;
  var state_name;
  var city_name;
  var done=false;
   await fetch(Geocoding_URL)
        .then(function (response) {        
            return response.json();
            })
            .then(function(data){
              console.log(data);
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
                  console.log("p");
                    console.log("1");
                    state_name=this.value;
                    dropdownEl.style.display="none";
                    barEl.style.display="none";
                    done=true;
                    console.log(state_name);
                    var index
                    for (var j=0;j<data.length;j++){
                      if(data[j].state==state_name){
                        index=j;
                      }
                    }
                    city_obj.lat=data[index].lat;
                    city_obj.long =data[index].lon;
                    city_obj.state=state_name;
                    city_obj.city=city_name;
                    console.log("lat ="+city_obj.lat);
                    console.log("lat ="+city_obj.long);
                  /*  if (!(visited_cities.includes(city_obj))){
                      visited_cities.push(city_obj);
                      localStorage.setItem("visited_cities",visited_cities);
                    }*/
                    console.log(city_obj);
                    display_weather();
                  //  return(city_obj);
                })
              }
              else{
                state_name=data[0].state;
                city_obj.lat=data[0].lat;
                city_obj.long =data[0].lon;
                city_obj.state=state_name;
                city_obj.city=city_name;
               /* if (!visited_cities.includes(city_obj)){
                  visited_cities.push(city_obj);
                  localStorage.setItem("visited_cities",visited_cities);
                }*/
                display_weather();
                //return(city_obj);
              }
              //console.log("ggggggg"+city_obj);
             
                return(city_obj)
              
              });
            
            //return(city_obj);         
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
      console.log(data);
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
  console.log("diplayed");
  console.log(city_obj);
  get_weather(city_obj);
}
function setname(event){
  event.preventDefault();
 /// if(set){
    //reset();
    //set=false;
  //}
  var city_name=cityEl.value;
  //console.log("llll"+city_obj);
  getGeocoding(city_name);
  //set=true;
  //console.log("mmmmmmm"+city_obj);
  /*a.then(function(result){
    console.log("klklkl");
    console.log(result);
  });*/  
  
  //console.log("after"+city_obj);
  
 /* if(city_obj){
    console.log("inside");
    get_weather(city_obj);
  }*/
  //console.log("kkkkkkkkkkklllllllllllll  ="+city_obj);
  //get_weather(city_obj);
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
              console.log(data);
              city=data[0].name;
              //console.log("lat : "+latitude);
              
              
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
                  console.log("p");
                // document.getElementById("item").addEventListener("click",function() {
                    console.log("1");
                    state_name=this.value;
                    dropdownEl.style.display="none";
                    barEl.style.display="none";
                    console.log(state_name);
                    var index
                    for (var j=0;j<data.length;j++){
                      if(data[j].state==state_name){
                        index=j;
                        //console.log(index);
                        //console.log(index);
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
                          console.log(data);
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
                        //console.log(index);
                        //console.log(index);
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
                          console.log(data);
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
//console.log(obj[0].name); */
//var weather_URL=`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${APIKey}`;        
//console.log("data are"+data);
































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


    