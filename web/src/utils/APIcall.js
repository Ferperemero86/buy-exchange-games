const axios = require("axios");

function apiCall(urlPath, callMethod, dataContent) {
    return axios({
        url: `https://api-v3.igdb.com/${urlPath}`,
        method: `${callMethod}`,
        headers: {
            'Accept': 'application/json',
            'user-key': '3f65f8d674e832923f475e2abc23fde5'
        },
        data: `${dataContent}`
    })
}

function getPostCall(urlPath, callMethod, dataContent) {
    return axios({
        url: `${urlPath}`,
        method: callMethod,
        data: { dataContent: dataContent }
    })
}

module.exports = { apiCall, getPostCall };

