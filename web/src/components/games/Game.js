import React from "react";

import Paragrapgh from "../Paragraph";


const Image = ({Url}) => {
    if (Url) {
        return <img src={`${Url}`} className="cover" />
    }
    return <p className="image-no-available">Image no available</p>
};

const Game = ({Url, title, page, gameId, platform}) => {
    let coverUrl;
    const platformName = platform ? platform.toUpperCase() : "";
    let name = title;
    
    if (title && title.length > 20 ) {
        name = title.slice(0, 20) + "...";
    }

    if (typeof Url === "string" && Url.indexOf("t_thumb") !== -1) {
        coverUrl = Url.replace("t_thumb", "t_cover_big");
    } else {
        coverUrl = Url;
    }
   
    return (
        <div className={`game ${page}`} key={gameId}>
            <div className="cover-container">
                <Image Url={coverUrl} />
            </div>
            <Paragrapgh className="title">{name}</Paragrapgh>
            <Paragrapgh className="platform">{platformName}</Paragrapgh>
        </div>
    )
  
}

export default Game;