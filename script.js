const apiKey = 'e1a6c05373adf8b0a9f8b334cc0bd645';

const searchForm = document.querySelector('#search-form');
const cityInput = document.querySelector('#city-input');
const weatherInfoContainer = document.querySelector('#weather-info-container');


searchForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const cityName = cityInput.value.trim();

    if (cityName) {
        getWeather(cityName);
    } else {
        alert('กรุณาป้อนชื่อเมือง');
    }
});


async function getWeather(city) {
    weatherInfoContainer.innerHTML = `<p>กำลังโหลดข้อมูล...</p>`;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=th`;

    localStorage.setItem('lastCity', city);// บันทึกชื่อเมืองล่าสุด


    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('ไม่พบข้อมูลเมืองนี้');
        }
        const data = await response.json();
        localStorage.setItem('lastCity', city);// บันทึกชื่อเมืองล่าสุด
        displayWeather(data);
    } catch (error) {
        weatherInfoContainer.innerHTML = `<p class="error">${error.message}</p>`;
    }
}

function displayWeather(data) {
    const { name, main, weather } = data;
    const { temp, humidity } = main;
    const { description, icon, main: weatherMain } = weather[0];

    updateBackground(temp, icon); // อัปเดตพื้นหลังตามอุณหภูมิและไอคอน
    renderWeatherAnimation(weatherMain); // อัปเดตแอนิเมชันสภาพอากาศ

    const weatherHtml = `
        <h2 class="text-2xl font-bold">${name}</h2>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
        <p class="temp">${temp.toFixed(1)}°C</p>
        <p>${description}</p>
        <p>ความชื้น: ${humidity}%</p>
    `;
    weatherInfoContainer.innerHTML = weatherHtml;
}



// อัปเดตพื้นหลังตามสภาพอากาศ
function updateBackground(temp, iconCode) {
    const hour = new Date().getHours();
    const isNight = iconCode.includes('n');
    const body = document.body;

    if (isNight || hour >= 18 || hour <= 6) {
        body.style.background = 'linear-gradient(#0f2027, #203a43, #2c5364)'; // กลางคืน
    } else if (temp > 30) {
        body.style.background = 'linear-gradient(#ff7300, #fef253)'; // ร้อน
    } else if (temp < 20) {
        body.style.background = 'linear-gradient(#2b5876, #4e4376)'; // หนาว
    } else {
        body.style.background = 'linear-gradient(#56ccf2, #2f80ed)'; // ปกติ
    }
}


// แสดงแอนิเมชันสภาพอากาศ
function renderWeatherAnimation(weatherMain) {
    const container = document.getElementById('weather-animation');
    container.innerHTML = ''; // clear old

    if (weatherMain === 'Clear') {
        const sun = document.createElement('div');
        sun.className = 'sun';
        container.appendChild(sun);
    } 
    else if (weatherMain === 'Rain') {
        for (let i = 0; i < 50; i++) {
            const drop = document.createElement('div');
            drop.className = 'rain-drop';
            drop.style.left = Math.random() * 100 + 'vw';
            drop.style.animationDelay = Math.random() + 's';
            container.appendChild(drop);
        }
    }
    else if (weatherMain === 'Snow') {
        for (let i = 0; i < 30; i++) {
            const flake = document.createElement('div');
            flake.className = 'snowflake';
            flake.textContent = '❄️';
            flake.style.left = Math.random() * 100 + 'vw';
            flake.style.top = Math.random() * 10 + '%';
            flake.style.animationDelay = Math.random() * 5 + 's';
            container.appendChild(flake);
        }
    }
    else if (weatherMain === 'Clouds') {
        const cloud = document.createElement('div');
        cloud.className = 'cloud-shape';
        container.appendChild(cloud);
    }
}




// เมื่อโหลดหน้าเว็บ ให้ดึงชื่อเมืองล่าสุดจาก localStorage
window.addEventListener('DOMContentLoaded', () => {
    const lastCity = localStorage.getItem('lastCity');
    if (lastCity) {
        getWeather(lastCity);
    }
});
