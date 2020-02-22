require('dotenv').config();

const axios = require('axios');

const GtfsRealtimeBindings = require('gtfs-realtime-bindings');

const apiURL = `http://datamine.mta.info/mta_esi.php?key=${process.env.MTA_KEY}&feed_id=`;

const router = require("express").Router();

const Station = require('../database/models/Stations')

const Feed = require('../database/models/Feeds')

const getTrainTimes = async (stop, feed) => {
    try {
        let { data } = await axios.request({
            method: "GET",
            url: `${apiURL}${feed}`,
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
        let mtaFeed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(body);
        let response = [];
        console.log(mtaFeed["header"]["timestamp"]);
        mtaFeed.entity.map(entity => {
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
                    if (stopId.includes(stop) && arrival) {
                        let currentTime = Date.now();
                        let arrivalTime = (arrival.time.low * 1000 - currentTime) / 60000;
                        if (arrivalTime >= 0) response.push({
                            routeId,
                            stopId,
                            arrival: arrivalTime.toFixed(0) + "Mins"
                        })
                    }
                })
            }
        })
        return response;
    } catch (error) {
        console.log(error);
        return [];
    }
}

const getFeedNumber = async (stopId) => {
    let FeedIds = new Set();
    try {
        let { dayTimeRoutes } = await Station.findAll({
            where: {
                stopId
            }
        }).then(data => data[0] || { dayTimeRoutes: false })
        if (dayTimeRoutes) {
            let routes = dayTimeRoutes.split(" ");
            for (let route of routes) {
                let { feedId } = await Feed.findOne({
                    where: {
                        trainId: route
                    }
                }).then(data => data)
                FeedIds.add(feedId);
            }
        }
        return FeedIds;
    }
    catch (error) {
        console.log(error);
        return FeedIds;
    }
}

router.get('/:stopId', async (req, res, next) => {
    let stopId = req.params.stopId;
    let feedNumber = await getFeedNumber(stopId);
    let response = {};
    for (let feedId of feedNumber) {
        response[feedId] = await getTrainTimes(stopId, feedId).then(data => data).catch(e => console.log(e));
    }
    res.status(200).send(response)
})

module.exports = router;