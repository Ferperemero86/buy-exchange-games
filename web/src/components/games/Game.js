import React, {useContext} from "react";
import {StoreContext} from "../../utils/store";

const RemoveGameButton = ({classEl, gameToRemove, page}) => {
    const {setGameFromListToExchange} = useContext(StoreContext);
    const {setGameToExchange} = useContext(StoreContext);
    const {gameToFind} = useContext(StoreContext);
    
    const removeGameFromExchange = () => {
        if (gameToRemove === "game1") {
            setGameFromListToExchange([]);
        }
        if (gameToRemove === "game2") {
            console.log("game2");
            setGameToExchange([]);
        }
    }

    if (page === "exchange-a-game" && gameToFind || gameToRemove === "game1") {
        return <button className={`${classEl}`} onClick={removeGameFromExchange}>Remove</button>
    }
    return null;
}

const Image = ({Url}) => {
    if (Url) {
        return <img src={`${Url}`} className="cover" />
    }
    return <p className="image-no-available">Image no available</p>
};

const Game = ({Url, title, page, gameId, platform, gameToRemove}) => {
    let coverURL;
    console.log("gamerrr to exchange", gameId);
    if (title) {
        if (typeof Url === "string" && Url.indexOf("t_thumb") !== -1) {
            coverURL = Url.replace("t_thumb", "t_cover_big");
        } 
    }

    return (
        <div className={`game ${page}`} key={gameId}>
            <RemoveGameButton classEl="remove-game-button" 
                              gameToRemove={gameToRemove} 
                              page={page} />
            <p>{platform}</p>
            <div className="cover-container">
                <Image Url={coverURL} />
            </div>
            <p className="title">{title}</p>
        </div>
    )
  
}

export default Game;