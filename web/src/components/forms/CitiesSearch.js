import React from "react";

import Option from "../Option";

const Cities = ({cities, onChange}) => {
    let keyVal = 0;
   
    if (cities && Array.isArray(cities)) {
        return cities.map(city => {
            keyVal++;
            return <Option 
                    value={city}
                    onChange={onChange}
                    key={city + keyVal}>{city}</Option> 
                    
            })
   }

   return <option>Something went wrong</option>
}

export default Cities;