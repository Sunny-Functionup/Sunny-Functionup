const axios = require("axios")

// url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`

const getWeather = async function (req, res) {
    
    const options = {
        method: "get",
        url: `http://api.openweathermap.org/data/2.5/weather?q=London&appid=c085dc9fc20640d3aed0becac655f4a2`
    }
    let result = await axios(options)
    let temp = result.data.main.temp
    res.status(200).send({ data: temp })
}

const allCity = ["Bengaluru", "Mumbai", "Delhi", "Kolkata", "Chennai", "London", "Moscow"]

const sortCityByTemp = async function (req, res) {
    try {
        
        const tempArr = []
        for (let city of allCity) {
            const options = {
                method: "get",
                url: `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=c085dc9fc20640d3aed0becac655f4a2`
            }
            let result = await axios(options)
            let temp = result.data.main.temp
            tempArr.push(temp)
        }

        const a = tempArr.map((num, i) => {
            return { city: allCity[i], temp: num }
        })
        const sort = a.sort((i, j) => i.temp - j.temp)
        res.status(200).send({ data: sort })
    } catch (e) {
        res.status(401).send({ Err: e.message })
    }
}

module.exports.getWeather = getWeather
module.exports.sortCityByTemp = sortCityByTemp