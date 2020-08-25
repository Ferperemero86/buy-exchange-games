import React from "react";

import Option from "../Option";

const Countries = ({countries, countryNames, onChange}) => {

    if (countryNames && (Array.isArray(countryNames)) ) {
        return countryNames.map(country => {
            const code = countries[country];
    
            return <Option 
                        value={code}
                        onChange={onChange}
                        key={country}>{country}</Option>
        })
    }
   
    return <option>Something went wrong</option>
}

export default Countries;