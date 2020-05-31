import React, {useContext, useEffect} from "react";
import axios from "axios";

import {RegisterContext} from "../providers/forms/RegisterProvider";

const Cities = ({cities}) => {
    const {register, dispatchRegister} = useContext(RegisterContext);
    const {selectedCountryCode} = register;
    let keyVal = 0;
   
    useEffect(() => {
        if (selectedCountryCode) {
            axios.post("/api/cities", {selectedCountryCode})
            .then(result => {
                 dispatchRegister({type: "UPDATE_CITIES", payload: result.data.cities})
            })
        }
    }, [selectedCountryCode]);

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