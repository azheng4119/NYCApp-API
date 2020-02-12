require('dotenv').config();

const axios = require('axios');

const GtfsRealtimeBindings = require('gtfs-realtime-bindings');

const apiURL = `http://datamine.mta.info/mta_esi.php?key=${process.env.MTA_KEY}&feed_id=1`;

const router = require("express").Router();

const Station = require('../database/models/Stations')

const getTrainTimes = async (request) => {
    let { data } = await axios.request({
        method: "GET",
        url: `${apiURL}`,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
            "content-type": 'application/json'
        },
        responseType: 'arraybuffer',
        responseEncoding: 'utf8'
    })
    const typedArray = new Uint8Array(data);
    const body = [...typedArray];
    let feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(body);
    let response = [];
    feed.entity.map(entity => {
        if (entity.tripUpdate) {
            let {
                tripUpdate: {
                    trip: {
                        routeId
                    },
                    stopTimeUpdate
                },
            } = entity;
            stopTimeUpdate.map(stopUpdate => {
                let { arrival, stopId } = stopUpdate;
                if (stopId.includes(request)) {
                    let currentTime = Date.now();
                    let arrivalTime = (arrival.time.low * 1000 - currentTime) / 60000;
                    response.push({
                        routeId,
                        stopId,
                        arrival: arrivalTime.toFixed(0) + "Mins"
                    })
                }
            })
        }
    })
    return response;
}

router.get('/:stopId', async (req, res, next) => {
    let request = req.params.stopId;
    let feed = await getTrainTimes(request);
    res.status(200).send(feed)
})

module.exports = router;