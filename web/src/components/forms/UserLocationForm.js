import React, {useContext, useEffect} from "react";
import axios from "axios";

import {UsersSellingContext} from "../providers/UsersSellingProvider";


const Locations = ({locations, type}) => {
    if (Array.isArray(locations) && locations.length > 0) {
        return locations.map(location => {
            let code;
            let name;
    
            if (type === "country") {
                code = location.code;
                name = location.name;
            }
    
            if (type === "state") {
                code = location.region;
                name = location.region;
            }

            if (type === "city") {
                code = location.city;
                name = location.city;
            }
           
            return <option value={code} 
                           key={name}>{name}</option>
        })
    }
    return <option>{locations}</option>
}

const Countries = ({showCountries}) => {
    const {usersSelling} = useContext(UsersSellingContext);
    const {countries} = usersSelling;

    useEffect(() => {
            const locationUrl = `http://battuta.medunes.net/api/country/all/?`;
            showCountries("/api/getlocations", locationUrl, "country");
    }, [countries.length]);
    
    return <Locations 
                locations={countries}
                type="country" />
}

const States = ({fetchLocation}) => {
    const {usersSelling} = useContext(UsersSellingContext);
    const {countrySelected, states} = usersSelling;
   
    useEffect(() => {
        if (countrySelected) {
            const locationUrl = `http://battuta.medunes.net/api/region/${countrySelected}/all/?`;
            fetchLocation("/api/getlocations", locationUrl, "state");
        }
    }, [countrySelected]);

    return <Locations 
                locations={states}
                type="state" />
}

const Cities = ({fetchLocation}) => {
    const {usersSelling} = useContext(UsersSellingContext);
    const {countrySelected, stateSelected, cities} = usersSelling;
    
    useEffect(() => {
        if (countrySelected && stateSelected) {
            const locationUrl = `http://battuta.medunes.net/api/city/${countrySelected}/search/?region=${stateSelected}&`;
            fetchLocation("/api/getlocations", locationUrl, "city");
        }
    }, [stateSelected]);

    return <Locations 
                locations={cities}
                type="city" />
}

const UserLocationForm = ({searchGames}) => {
    const {dispatchUsersSelling} = useContext(UsersSellingContext);

    const fetchLocation = async (Url, locationUrl, type) => {
        await axios.post(Url, {locationUrl})
                .then(result => {
                    const locations = result.data.locations.error ? [] :  result.data.locations;
    
                    if (type === "state") {
                        dispatchUsersSelling({type: "UPDATE_STATES", payload: locations});
                    }
                    if (type === "country") {
                        dispatchUsersSelling({type: "UPDATE_COUNTRIES", payload: locations});
                    }
                    if (type === "city") {
                        dispatchUsersSelling({type: "UPDATE_CITIES", payload: locations});
                    }
                })
                .catch(err => {
                    console.log(err);
                })
    }

    const showCountries = () => {
        const locationUrl = `http://battuta.medunes.net/api/country/all/?`;
        fetchLocation("/api/getlocations", locationUrl, "country");
    }

    const updateLocation = (e) => {
        const location = e.target.value;
        const locationType = e.currentTarget.getAttribute("data-location-type");

        if (locationType === "country") {
            dispatchUsersSelling({type: "UPDATE_SELECTED_COUNTRY", payload: location});
        }
        if (locationType === "state") {
            dispatchUsersSelling({type: "UPDATE_SELECTED_STATE", payload: location});
        }
        if (locationType === "city") {
            searchGames("/api/usersselling/search", location);
        }
    }

    return (
        <form className="user-location-form">
            <div className="countries">
                <label>Countries</label>
                <select onChange={updateLocation}
                        data-location-type="country">
                    <Countries showCountries={showCountries} />
                </select>
            </div>
            <div className="states">
                <label>States</label>
                <select data-location-type="state"
                        onChange={updateLocation}>
                    <States fetchLocation={fetchLocation} />
                </select>
            </div>
            <div className="cities">
                <label>Cities</label>
                <select data-location-type="city"
                        onChange={updateLocation}>
                    <Cities fetchLocation={fetchLocation} />
                </select>
            </div>
        </form>
    )
}

export default UserLocationForm;