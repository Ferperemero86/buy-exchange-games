import React, {useEffect, useContext} from "react";

import axiosModule from "../../utils/APIcall";
import { StoreContext } from "../../utils/store";
import { useRouter } from 'next/router';

const Games = ({games, platform}) => {

    const { gamesIndex } = useContext(StoreContext);
    const router = useRouter();

    const redirectToDetails = (gameName) => {
        router.push({
            pathname: `/explore/details`,
            query: {
                name: gameName,
                platform: platform
            }
        });
    };

    const getGameInfo = (e) => {
        const gameName = e.currentTarget.dataset.name;
        redirectToDetails(gameName);
    };


    return Object.keys(games).map(() => {
        return games[gamesIndex].map(game => {
            return (
                <div key={game.id}
                    onClick={getGameInfo}
                    data-name={game.name}
                    data-platform={game.platform}
                    className="game-container link">
                    <p className="title">{game.name}</p>
                    <img src={`${game.cover.url}`} className="cover" />
                </div>
            )
        })
    });
};


const Links = ({ platformTitle, recentGamesLink, allGamesLink, displayAllGames, displayRecentGames }) => {
    return (
        <div className="explore-games-links">
            <h2
                className={`recent-games-link ${recentGamesLink}`}
                onClick={displayRecentGames}>{`${platformTitle}`} RECENT GAMES</h2>
            <h2
                className={`all-games-link ${allGamesLink}`}
                onClick={displayAllGames}>All Games</h2>
        </div>
    )
};

const Pagination = () => {
    const { games } = useContext(StoreContext);
    const { gamesIndex, setGamesIndex } = useContext(StoreContext);

    const updateGamesIndex = (e) => {
        const pageIndex = e.currentTarget.dataset.page;
        setGamesIndex(pageIndex);
    }

    return (
        <div className="games-pagination">
            <ul>
                {
                    Object.keys(games).map(index => {
                        const indexNumber = parseInt(index) + 1;
                        const indexSelected = parseInt(index);
                        let selectedIndexClass = "";

                        if (indexSelected === 0 && gamesIndex === 0 || gamesIndex === index) {
                            selectedIndexClass = "selected-index"
                        }

                        return (
                            <li
                                className={`games-page ${selectedIndexClass}`}
                                key={index}
                                data-page={index}
                                onClick={updateGamesIndex}>{indexNumber}</li>
                        )
                    })
                }
            </ul>
        </div>
    )
};

const GamesDisplay = ({ platform, platformTitle, platformId }) => {
    const { games, setGames } = useContext(StoreContext);
    const { recentGamesLink, setRecentGamesLink } = useContext(StoreContext);
    const { allGamesLink, setAllGamesLink } = useContext(StoreContext);
    const { gameDetails, setGameDetails } = useContext(StoreContext);
    const { setGamesIndex } = useContext(StoreContext);
    
    const displayAllGames = () => {
        setAllGamesLink("recent-games-link-styles");
        setRecentGamesLink("");
        axiosModule.getPostCall(`/api/games/${platform}`, "POST", `fields name, cover.url; where platforms = {${platformId}};limit 300;`)
            .then(response => {
                organizeGames(response.data.gamesContent);
                setGamesIndex(0);
            })
            .catch(err => {
                console.error(err);
            });
    };

    const displayRecentGames = () => {
        setAllGamesLink("");
        if (recentGamesLink === "") {
            setRecentGamesLink("recent-games-link-styles");
        } else {
            setRecentGamesLink("");
        }
        axiosModule.getPostCall(`/api/games/${platform}`, "POST", `fields name, cover.url; where platforms = {${platformId}} & release_dates.date > 1514764800;limit 100;`)
            .then(response => {
                organizeGames(response.data.gamesContent);
                setGamesIndex(0);
            })
            .catch(err => {
                console.error(err);
            });
    };

    const organizeGames = (games) => {
        let index = 0;
        let gamesNav = [];

        games.map(game => {
            if (!game.name || !game.cover) {
                return null
            }

            if (!gamesNav[index]) {
                gamesNav[index] = [game];
            } else {
                gamesNav[index].push(game);
            }

            if (gamesNav[index].length === 50) {
                index++;
            }
        });

        setGames(gamesNav);
    }


    useEffect(() => {
        if (games.length === 0) {
            axiosModule.getPostCall(`/api/games/pc`, "POST", `fields name, cover.url; where platforms = {${platformId}} & release_dates.date > 1514764800;limit 100;`)
                .then(response => {
                    organizeGames(response.data.gamesContent)
                })
                .catch(err => {
                    console.error(err);
                });
        }
        if (gameDetails !== []) {
            setGameDetails([]);
        }
    }, [games.length]);

    return (
        <div className="explore-games-container" >
            <Links
                platformTitle={platformTitle}
                displayAllGames={displayAllGames}
                displayRecentGames={displayRecentGames}
                recentGamesLink={recentGamesLink}
                allGamesLink={allGamesLink} />
            <Games
                games={games}
                platform={platform} />
            <Pagination
                games={games} />
        </div >
    )
}


export default GamesDisplay;




