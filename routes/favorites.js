const stations = require('../data/stations');
const feeds = require('../data/feed')
const Station = require('../database/models/Station')
const Feed = require('../database/models/Feeds')

module.exports = () => {
    Object.keys(stations).map(async stat => {
        let station = stations[stat];
        await Station.create({
            stationId : station["Station ID"],
            stopId : stat,
            line : station["Line"],
            stopName : station["Stop Name"],
            daytimeRoutes : station["Daytime Routes"],
            latitude : station["GTFS Latitude"],
            longitude : station["GTFS Longitude"],  
        }).then().catch(error => console.log(error));
    })
    Object.keys(feeds).map(async feed => {
        let feedId = feeds[feed];
        await Feed.create({
            trainId : feed,
            feedId
        })
    })
}