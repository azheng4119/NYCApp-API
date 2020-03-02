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
        let response = {};
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
                        let side = stopId[stopId.length - 1] === 'N' ? "North" : "South";
                        if (arrivalTime >= 0) {
                            if (!(routeId in response)) {
                                response[routeId] = {
                                    TrainNumber: routeId,
                                    North: [],
                                    South: [],
                                };
                            }
                            response[routeId][side].push(arrivalTime.toFixed(0));
                        }
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

const getFeedNumber = async (stopName) => {
    let FeedIds = new Set();
    let stopId = "";
    try {
        let { dayTimeRoutes, stopId } = await Station.findAll({
            where: {
                stopName
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
        return [FeedIds, stopId];
    }
    catch (error) {
        console.log(error);
        return [FeedIds, stopId];
    }
}

router.get('/:stopName', async (req, res, next) => {
    let stopName = req.params.stopName;
    let [feedNumber, stopId] = await getFeedNumber(stopName);
    let response = [];
    if (response) {
        for (let feedId of feedNumber) {
            response.push(await getTrainTimes(stopId, feedId).then(data => data).catch(e => console.log(e)));
        }
        res.status(200).send(response)
    }else{
        res.status(400).send(response)
    }
})

module.exports = router;