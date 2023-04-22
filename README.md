# Weather-Dashboard
var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";

https://api.openweathermap.org/data/2.5/onecall?lat=38.7267&lon=-9.1403&exclude=current,hourly,minutely,alerts&units=metric&appid={API key}

https://api.openweathermap.org/data/2.5/forecast/daily?lat=${latitude}&lon=${longitude}&cnt=5&units=imperial&appid=${APIKey}


var five_days_weatherURL=`https://api.openweathermap.org/data/2.5/forecast/daily?lat=${latitude}&lon=${longitude}&cnt=5&appid=${APIKey}&units=imperial`;


https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&cnt=5&exclude=hourly,daily&appid=${APIKey}&units=imperial