import React from "react";

const Cities = ({cities}) => {
    let keyVal = 0;
   
    if (cities && Array.isArray(cities)) {
        return cities.map(city => {
            keyVal++;
            return <option 
                        key={city + keyVal}>{city}</option>
            })
   }

   return <option>Something went wrong</option>
}

export default Cities;