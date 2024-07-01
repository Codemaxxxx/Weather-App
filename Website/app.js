const generate = document.getElementById('generate');
const zip = document.getElementById('zip');
const userResponse = document.getElementById('user-response');
const date = document.getElementById('date');
const temp = document.getElementById('temp');
const feelings = document.getElementById('feelings');
const city = document.getElementById('myCity');
const weather = document.getElementById('weather');
const error = document.getElementById('message');
const d = new Date();
const myDate = d.toDateString();
const example = 'https://api.openweathermap.org/data/2.5/weather?zip={zip code}&appid={API key}';
const baseURL = 'https://api.openweathermap.org/data/2.5/weather?zip=';
const key = '&appid=c4d7d7299301fa5cbca4a524bcd48216&units=imperial';


generate.addEventListener('click', (event) => {
    event.preventDefault();
    const clientURL = `${baseURL}${zip.value}${key}`;
    getData(clientURL)
    .then((data) => {
        makeData(data)
        .then((info) => {
            postData('/add', info)
            .then((data) => {
                retrieveData('/all')
                .then(data => {
                    updateUI(data);
                })
            })
        })
    })
});


const getData = async(url) => {
    try {
        const answer = await fetch(url);
        const result = await answer.json();
        if(result.cod != 200) {
            return result;
        }
        return result;
    }catch(e) {
        console.log(e.message);
    }
}


const makeData = async(data) => {
    try {
        if(data.cod != 200) {
            return data;
        }
            const info = {
                city: data.name,
                date: myDate,
                feelings: userResponse.value,
                temp: Math.round(data.main.temp),
                weather: data.weather[0].main,
                country: data.sys.country
            };
            return info;
    }catch(e) {
        console.log(e);
    }
}

const postData = async ( url='', data={})=>{
    const answer = await fetch('http://localhost:5500/add', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    try {
        const result = await answer.json();
        return result;
    }catch(err) {
        console.log(err)
    }
};

const retrieveData = async (url) => {
    const answer = await fetch('http://localhost:5500/all');
    try {
        const result = await answer.json();
        return result;
    }catch(err) {
        console.error(err);
    }
};

const updateUI = async (info) => {
    if(!info.message) {
        city.innerHTML = info.city + ',' + info.country;
        temp.innerHTML = `${info.temp}&#176`;
        weather.innerHTML = info.weather;
        feelings.innerHTML = info.feelings? info.feelings : 'How do you feel;'
        date.innerHTML = info.date;
        message.innerHTML = ''
        document.querySelector('.weather-output').style.opacity = '1';

        if(info.temp < 32) {
            document.querySelector('img').setAttribute('src', './images/drizzle.png');
        }else if(info.temp>80) {
            document.querySelector('img').setAttribute('src', './images/cloudy.png');
        }
    }else {
        document.querySelector('.weather-output').style.opacity = '1'
        setTimeout(async () => {
            document.querySelector('.weather-hide').style.opacity = '0';
            document.querySelector('.weather-hide').style.display = 'none';
            message.innerHTML = 'please enter a valid ZIP CODE';
        }, 1000);
    }
}