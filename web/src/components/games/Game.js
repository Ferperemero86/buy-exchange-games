import React from "react";

const Game = ({Url, title, page}) => {
    let coverURL;

    if (title) {
        if (page === "sell-a-game") {
            coverURL = Url.replace("t_thumb", "t_cover_big");
        }

        return (
            <div className={`game ${page}`}>
                <div className="cover-container">
                    <img src={`${coverURL}`} className="cover" />
                </div>
                <p className="title">{title}</p>
            </div>
        )
    }
    return null;
}

export default Game;