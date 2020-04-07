import Link from "next/link";
import {useEffect, useContext, useRef } from "react";
import { StoreContext } from "../../utils/store";

const Cover = ({cover}) => {
    if(cover) {
        return <img src={`${cover.url}`} />
    } else {
        return <p>Image no available</p>
    }
};

const Game = ({game}) => {
    const {platform} = useContext(StoreContext);
    const {page} = useContext(StoreContext);
    const gameId = game.id;
    const summary = game.summary;
    const longName = game.name; 
    let nameString;
    let cover;
    
    if (game.name) {
        nameString = game.name;
    } else {
        nameString = "No Title";
    }
    let name = nameString;
    if(nameString.length > 19) {
        const shorterName = nameString.substring(0,19);
        name = `${shorterName} ...`;
    }
    if (game.cover) {
        cover = game.cover.url;
    } else {
        cover = "";
    }
    
    return (
        <Link 
            href={{ pathname: "/explore/details", 
                    query: {id: gameId, 
                            longName, 
                            platform, 
                            cover, 
                            summary,
                            page } }}
            key={gameId} >
            <div className="game">
                <p className="title">{name}</p>
                <div className="cover">
                     <Cover cover={game.cover} />
                </div>
            </div>
        </Link>
    )
    
};

const Games = () => {
    const {games} = useContext(StoreContext);
    const {page} = useContext(StoreContext);
    let index = parseInt(page);

    if(index > 0) {
        index--;
    }

    if(games[index]) {
        return games[index].map(game=> {
            return <Game game={game} key={game.id}/>
        })
    } else {
        return null;
    }
};

const Pagination = () => {
    const {games} = useContext(StoreContext);
    const {page} = useContext(StoreContext);
    const {platform} = useContext(StoreContext);
    const listRef = useRef(null);

    let indexNav = 0;
    
    const changeStyle = (e) => {
        const children = listRef.current.children;

        Object.keys(children).map(val => {
            const classExists = children[val].classList.contains("selected");
            
            if(classExists) {
                children[val].classList.remove("selected");
            }
        });

        e.currentTarget.classList.add("selected");
        
    };

    const setFirstPageStyle = () => {
        let selected = "";

        if (page === indexNav) {
            selected = "selected";
        } else {
            selected = "";
        }

        return selected;
    };

    if(games.length > 0) {

        return(  
            <div className="pagination">
                <ul className="pagination-list" ref={listRef}>
                    {
                        games.map(game => {
                            indexNav++;
                           
                            const selected = setFirstPageStyle();

                            return (
                                <Link 
                                    href={{ pathname: `/explore/${platform}`, query: {page: indexNav} }} 
                                    key={indexNav} >
                                    <li className={`pagination-list-element ${selected}`} onClick={changeStyle}>{indexNav}</li>
                                </Link>
                            )
                        })
                    }
                </ul>
            </div>
        )
    } else {
        return null;
    }
};

const organizeGames = (gamesFromServer) => {
    let gamesIndex = 0;
    let paginationGames = [];

    Object.keys(gamesFromServer).map((val) => {    
        gamesFromServer[val].map((game) => {
            if(!paginationGames[gamesIndex]) {
                paginationGames[gamesIndex] = [];
            }
            if( paginationGames[gamesIndex].length < 50) {
                paginationGames[gamesIndex].push(game);
            } else {
                gamesIndex++;
                paginationGames[gamesIndex] = [];
                paginationGames[gamesIndex].push(game);
            }
        });
    });
    return paginationGames;
};

const GamesDisplay = ({gamesFromServer}) => {
    const {games, setGames} = useContext(StoreContext);
    
    const result = organizeGames(gamesFromServer);
        useEffect(() => {
            setGames(result);
        }, [games.length]);

    return (
         <div id="explore-games">
            <Games />
            <Pagination/>         
         </div>
    )
};


export default GamesDisplay;




