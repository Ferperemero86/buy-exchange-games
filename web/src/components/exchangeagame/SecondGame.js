import React, {useContext} from "react";

import {TransactionsContext} from "../providers/TransactionsProvider";

import Game from "../../components/games/Game";
import Button from "../forms/Button";
import Select from "../Select";
import Option from "../Option";
import Label from "../Label";

const PlatformsOptions = () => {
    const platforms = [{name: "PS4", code: 48}, 
                       {name: "XBOX", code: 49}, 
                       {name: "PC", code: 6}];

    if (platforms && Array.isArray(platforms)) {
        return platforms.map(platform => {
            return <Option value={platform.code}
                           className="platform-options"
                           key={platform.code}>{platform.name}</Option>
        })
    }
    return null;
}

const PlatformSelect = () => {
    const {dispatchTransactions} = useContext(TransactionsContext);

    const getPlatformValue = (e) => {
        const platform = e.target.value;
        
        dispatchTransactions({type: "UPDATE_SELECTED_PLATFORM", payload: platform})
    }

    return (
        <div className="platforms-select">
            <Label
             text="Platforms" 
             className="label" />
            <Select onChange={getPlatformValue}
                    className="select"><PlatformsOptions /></Select>
        </div>
    )
}

const SecondGame = () => {
    const {transactions, dispatchTransactions} = useContext(TransactionsContext);
    const {gameToExchange, platformSelected} = transactions; 
    
    const openSearchWindow = () => {
        dispatchTransactions({type: "SHOW_EXCHANGE_SEARCH_WINDOW", payload: true})
        dispatchTransactions({type: "SET_GAME_TO_FIND", payload: "game2"})
        dispatchTransactions({type: "SET_EXCHANGE_GAMES_SEARCH", payload: []})
    }

    if (Array.isArray(gameToExchange) && gameToExchange.length > 0) {
        const cover = gameToExchange[0].cover.url;
        const title = gameToExchange[0].name;
        
        return (
            <div>
                <div className="game-2">
                    <Game Url={cover} 
                          title={title} 
                          gameToRemove= "game2"
                          platform={platformSelected.name}
                          page="exchange-a-game" />
                </div>
            </div> 
        ) 
    } 

    return (
        <div>
            <div className="find-a-game2">
                <Button className="button" 
                        game="game2"
                        text="Find Game"
                        onClick={openSearchWindow} />
            </div>
            <PlatformSelect />
        </div>
    )
}

export default SecondGame;