import React from "react";

const Countries = ({countries, countryNames}) => {

    if (countryNames && (Array.isArray(countryNames)) ) {
        return countryNames.map(country => {
            const code = countries[country];
    
            return <option 
                        value={code}
                        key={country}>{country}</option>
        })
    }
   
    return <option>Something went wrong</option>
}

export default Countries;