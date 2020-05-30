const fetch = require("node-fetch");
const axios = require("axios");

module.exports = {
  fetchApiData: async (URL, method, query) => {
    const result = await fetch(`https://api-v3.igdb.com/${URL}`, {
      method,
      headers: {
        'Accept': 'application/json',
        'user-key': '3f65f8d674e832923f475e2abc23fde5'
      },
      body: query
    });
    
    const data = await result.json();
    
    return data;
  },
  sendLocalData: async (Url, query) => {
    const result = await fetch(Url, { method: "POST", 
                                      body: JSON.stringify(query), 
                                      headers: {'Content-Type': 'application/json'} });
    if (Array.isArray(result) !== true) {
      const data = await result.json();
      return data;
    }
    return result;
  },
  getLocalData: async (Url) => {
    const result = await fetch(Url, {
      headers: {'Accept': 'application/json'} 
    });
   
    if (Array.isArray(result) !== true) {
      const data = await result.json();
      return data;
    }
    return result;
    
  },
  uploadFile: async (file) => {
    await axios({
      url: "https://api.cloudinary.com/v1_1/dby4kdmbv/image/upload",
      method: "POST",
      headers: {"Content-type": "x-www-form-urlencoded"},
      data: file
    })
    .then(result => {
      console.log(result)
    })
    .catch(err => {
      console.log(JSON.stringify(err));
    })
  }
}

