import React, { useEffect, useState } from "react";
import Link from 'next/link';

import axiosModule from "../utils/APIcall";

export default ({ platform, dataContent, title }) => {
    const [games, setGames] = useState([]);

    useEffect(() => {
        axiosModule.getPostCall(`/api/games/${platform}`, "POST", dataContent)
            .then(response => {
                setGames(response.data.gamesContent)
            })
            .catch(err => {
                console.error(err);
            });
    }, [games.length]);

    return (
        games.map(game => {
            if (!game.name || !game.cover) {
                return null
            } else {
                return (
                    <Link href={`/explore/${platform}`} key={game.id}>
                        <div className="game-container">
                            <p className="title">{title}</p>
                            <img src={`${game.cover.url}`} className="cover" />
                        </div>
                    </Link>
                )
            }
        })
    )
}
