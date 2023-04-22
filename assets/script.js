const APIKey="537f8a6f1c2847e5c474a3c3f52efc17";
const APIKey_daily="c49a6cb97c14282afdca683da085b1f5";
const dropdownEl=document.getElementById("drop");
const barEl=document.getElementById("drpo_bar");
const searchEl=document.getElementById("search");
const stat_listEl=document.getElementById("state_list");
const cityEl=document.getElementById("city-search");
const menuEl=document.getElementById("dropdownMenuButton");
const todayEl=document.getElementById("today");
const five_daysEl=document.getElementById("five_days_weather");
const weather_symbols=[{name:"sunny",class:"fas fa-sun",style:style="color:rgb(255,200,26)"}];
var latitude;
var longitude;
var stats=[];
var city;
var obj;

searchEl.addEventListener("click",fetch_function);
function fetch_function(event){
if (cityEl.value){
  event.preventDefault();
  var Geocoding_URL=`http://api.openweathermap.org/geo/1.0/direct?q=${cityEl.value}&limit=5&appid=537f8a6f1c2847e5c474a3c3f52efc17`;
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
              for (var i=0; i<data.length;i++){
                if(data[i].country=="US"){
                  stats.push(data[i].state);
                  $(stat_listEl).append(`
                  <li><a class="dropdown-item" href="#" id="item">${data[i].state}</a></li>
                  `);
                }
              }
              menuEl.addEventListener("click",function() {
                console.log("p");
                document.getElementById("item").addEventListener("click",function() {
                  console.log("1");
                  state_name=this.innerHTML;
                  var index
                  for (var j=0;j<data.length;j++){
                    if(data[j].state==state_name){
                      index=j;
                      //console.log(index);
                      //console.log(index);
                      latitude=data[index].lat;
                      longitude =data[index].lon;
                    }
                  }
                  /*var weather_URL=`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${APIKey}&units=imperial&cnt=3`;
                  fetch(weather_URL)
                    .then ( function (response){
                      return response.json();
                    })
                    .then(function(data){
                      console.log(data);
                      var city_name=data.name;
                      var Today_date=dayjs().format('MM/DD/YYYY');
                      var max_temp=data.main.temp_max;
                      var min_temp=data.main.temp_min;
                      var humidity=data.main.humidity;
                      var wind=data.wind.speed;
                      var icon_picture=data.weather[0].icon;
                      
                     
                    });*/
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
                });
            });
              
            }
            
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
//console.log(obj[0].name);
var weather_URL=`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${APIKey}`;        
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


    