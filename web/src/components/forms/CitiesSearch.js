import React, {useContext, useEffect} from "react";
import axios from "axios";

import {FormsContext} from "../providers/FormsProvider";

const Cities = ({cities}) => {
    const {forms, dispatchForms} = useContext(FormsContext);
    const {selectedCountryCode} = forms;
    let keyVal = 0;
   
    useEffect(() => {
        if (selectedCountryCode) {
            axios.post("/api/cities", {selectedCountryCode})
            .then(result => {
                 dispatchForms({type: "UPDATE_CITIES", payload: result.data.cities})
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