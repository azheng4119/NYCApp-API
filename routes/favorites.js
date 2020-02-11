const stations = require('../data/stations');
const Station = require('../database/models/Stations')

module.exports  = () => {
    // console.log(Object.values(stations));
    Object.values(stations).map(async station => {
        await Station.create({
            stationId : station["Station ID"],
            line : station["Line"],
            stopName : station["Stop Name"],
            daytimeRoutes : station["Daytime Routes"],
            latitude : station["GTFS Latitude"],
            longitude : station["GTFS Longitude"],  
        }).then().catch(error => console.log(error));
    })
}