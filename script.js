const wrapper = document.querySelector(".wrapper"),
    inputPart = wrapper.querySelector(".input-part"),
    infoTxt = inputPart.querySelector(".info-txt"),
    inputField = inputPart.querySelector("input"),
    locationBtn = inputPart.querySelector("button"),
    weatherIcon = wrapper.querySelector(".weather-part img"),
    arrowBack = wrapper.querySelector("header i"),
    apiKey = "402e1ee796dc7486ca3ad715333434e8";

let api;

inputField.addEventListener("keyup", e => {
    if (e.key === "Enter" && inputField.value != "") {
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSucess, onError);
    } else {
        alert("Seu navegador não suporta API de geolocalização");
    }
});

function onSucess(position) {
    const { latitude, longitude } = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&lang=pt_br&units=metric&appid=${apiKey}`;
    fetchData();
}

function onError(error) {
    infoTxt.innerHTML = error.message;
    infoTxt.classList.add("error");
}

function requestApi(city) {
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=pt_br&units=metric&appid=${apiKey}`;
    fetchData();
}

function fetchData() {
    infoTxt.innerHTML = "Obtendo detalhes do clima...";
    infoTxt.classList.add("pending");
    fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}

function weatherDetails(info) {
    if (info.cod === "404") {
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = `${inputField.value} não é uma cidade válida`;

    } else {
        const city = info.name;
        const country = info.sys.country;
        const { description, id } = info.weather[0];
        const { feels_like, humidity, temp } = info.main;

        if (id === 800) {
            weatherIcon.src = "./icons/clear.png";
        } else if (id >= 200 && id <= 232) {
            weatherIcon.src = "./icons/storm.png";
        } else if (id >= 600 && id <= 622) {
            weatherIcon.src = "./icons/snow.png";
        } else if (id >= 701 && id <= 781) {
            weatherIcon.src = "./icons/haze.png";
        } else if (id >= 801 && id <= 804) {
            weatherIcon.src = "./icons/cloud.png";
        } else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
            weatherIcon.src = "./icons/rain.png";
        }

        wrapper.querySelector(".temp .numb").innerHTML = Math.floor(temp);
        wrapper.querySelector(".weather").innerHTML = description;
        wrapper.querySelector(".location span").innerHTML = `${city}, ${country}`;
        wrapper.querySelector(".temp .numb-2").innerHTML = Math.floor(feels_like);
        wrapper.querySelector(".humidity span").innerHTML = `${humidity}%`;

        infoTxt.classList.remove("pending", "error");
        wrapper.classList.add("active");
    }
    console.log(info);
}

arrowBack.addEventListener("click", () => {
    wrapper.classList.remove("active");
    inputField.value = "";
    inputField.focus();
});