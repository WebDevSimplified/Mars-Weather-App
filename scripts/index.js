const API_KEY = 'DEMO_KEY'
const API_URL = `https://api.nasa.gov/insight_weather/?api_key=${API_KEY}&feedtype=json&ver=1.0`

const currentSolElement = document.querySelector('[data-current-sol]')
const currentDateElement = document.querySelector('[data-current-date]')
const currentTempHighElement = document.querySelector('[data-current-temp-high]')
const currentTempLowElement = document.querySelector('[data-current-temp-low]')
const windSpeedElement = document.querySelector('[data-wind-speed]')
const windDirectionText = document.querySelector('[data-wind-direction-text]')
const windDirectionArrow = document.querySelector('[data-wind-direction-arrow]')

const previousSolTemplate = document.querySelector('[data-previous-sol-template]')
const previousSolContainer = document.querySelector('[data-previous-sols]')

const previousWeatherToggle = document.querySelector('[data-previous-weather-toggle]')
const previousWeatherContainer = document.querySelector('[data-previous-weather-container]')

previousWeatherToggle.addEventListener('change', () => {
  previousWeatherContainer.classList.toggle('show-weather')
})

getWeather().then(sols => {
  displaySelectedSol(sols)
  displayPreviousSols(sols)
})

function getWeather() {
  return fetch(API_URL)
    .then(res => res.json())
    .then(resData => {
      const {
        sol_keys,
        validity_checks,
        ...solData
       } = resData
      return Object.entries(solData).map(([sol, data]) => {
        return {
          sol: sol,
          maxTemp: data.AT.mx,
          minTemp: data.AT.mn,
          windSpeed: data.HWS.av,
          windDirectionDegrees: data.WD.most_common.compass_degrees,
          windDirectionCardinal: data.WD.most_common.compass_point,
          date: new Date(data.First_UTC)
        }
      })
    })
}

function displaySelectedSol(sols, selectedIndex = sols.length - 1) {
  const selectedSol = sols[selectedIndex]
  currentSolElement.innerText = selectedSol.sol
  currentDateElement.innerText = displayDate(selectedSol.date)
  currentTempHighElement.innerText = Math.round(selectedSol.maxTemp)
  currentTempLowElement.innerText = Math.round(selectedSol.minTemp)
  windSpeedElement.innerText = Math.round(selectedSol.windSpeed)
  windDirectionText.innerText = selectedSol.windDirectionCardinal
  windDirectionArrow.style.setProperty('--direction', `${selectedSol.windDirectionDegrees}deg`)
}

function displayPreviousSols(sols) {
  previousSolContainer.innerHTML = ''
  sols.forEach((solData, index) => {
    const solContainer = previousSolTemplate.content.cloneNode(true)
    solContainer.querySelector('[data-sol]').innerText = solData.sol
    solContainer.querySelector('[data-date]').innerText = displayDate(solData.date)
    solContainer.querySelector('[data-temp-high]').innerText = Math.round(solData.maxTemp)
    solContainer.querySelector('[data-temp-low]').innerText = Math.round(solData.minTemp)
    solContainer.querySelector('[data-select-button]').addEventListener('click', () => {
      displaySelectedSol(sols, index)
    })
    previousSolContainer.appendChild(solContainer)
  })
}

function displayDate(date) {
  return date.toLocaleDateString(
    undefined,
    { day: 'numeric', month: 'long' }
  )
}