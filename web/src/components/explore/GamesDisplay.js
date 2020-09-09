import Link from "next/link";
import React, {useEffect, useContext, useRef} from "react";
import {useRouter} from "next/router";

import disableScroll from 'disable-scroll';

import Paragraph from "../Paragraph";
import Button from "../forms/Button";

import {ExploreGamesContext} from "../providers/ExploreGamesProvider";
import Heading from "../Heading";


const Cover = ({cover}) => {
    if(cover) {
        return <img src={`${cover}`} />
    } else {
        return <Paragraph>Image no available</Paragraph>
    }
};

const Game = ({game}) => {
    const {exploreGames} = useContext(ExploreGamesContext);
    const {platform} = exploreGames;
    const gameId = game.id;
    let nameString;
    let cover;
    const router = useRouter();
   
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
        const bigImage = game.cover.url.replace("t_thumb", "t_cover_big");
        cover = bigImage;
    } else {
        cover = "";
    }

    const goToDetails = () => {
        router.push({pathname: "/explore/details", 
                     query: {id: gameId, platform}})
    }

    return (
        <div className="game">
            <Paragraph className="title">{name}</Paragraph>
            <div className="cover">
                 <Cover cover={cover} />
            </div>
            <Button 
             className="button" 
             text="Details"
             onClick={goToDetails} />
        </div>
    )
    
}
const Games = () => {
    const {exploreGames} = useContext(ExploreGamesContext);
    let index = parseInt(exploreGames.page);

    useEffect(() => {
        disableScroll.off();
    })

    if (index > 0) {
        index--;
    }
    
    if (exploreGames.games[index]) {
        return exploreGames.games[index].map(game=> {
            return <Game game={game} key={game.id}/>
        })
    } 
       
    return null;
    
};

const Pagination = () => {
    const {exploreGames, dispatchExploreGames} = useContext(ExploreGamesContext);
    const listRef = useRef(null);
    let indexNav = 0;

    const changeStyle = (e) => {
        const children = listRef.current.children;

        disableScroll.on();

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

        if (exploreGames.page === indexNav) {
            selected = "selected";
        } else {
            selected = "";
        }

        return selected;
    };

    const updatePage = (e) => {
        const page = e.target.getAttribute("data-page");
        
        dispatchExploreGames({type: "UPDATE_PAGE", payload: page});

        changeStyle(e);
    }
    
    if (exploreGames.games.length < parseInt(exploreGames.page) || isNaN(exploreGames.page)) {
        return <Heading
                className="games-no-available"
                type="h1"
                text="Games no available" />
    }

    if(exploreGames.games.length > 0) {

        return(  
            <div className="pagination">
                <ul className="pagination-list" ref={listRef}>
                    {
                        exploreGames.games.map(() => {
                            indexNav++;
                           
                            const selected = setFirstPageStyle();

                            return (
                                <Link 
                                    href={{ pathname: `/explore/${exploreGames.platform}`, query: {page: indexNav} }} 
                                    key={indexNav} >
                                    <li className={`pagination-list-element ${selected}`}
                                        data-page={indexNav}
                                        onClick={updatePage}>{indexNav}</li>
                                </Link>
                            )
                        })
                    }
                </ul>
            </div>
        )
    } 
        
    return null;
    
};

const organizeGames = (games) => {
    let gamesIndex = 0;
    let paginationGames = [];

    Object.keys(games).map((val) => {    
        games[val].map((game) => {
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

const GamesDisplay = () => {
    const {exploreGames, dispatchExploreGames} = useContext(ExploreGamesContext);
    const {games} = exploreGames;

    const result = organizeGames(games);

    useEffect(() => {
        dispatchExploreGames({type: "UPDATE_GAMES", payload: result});
    }, [exploreGames.games.length]);

    return (
        <div id="explore-games">
            <Games />
            <Pagination />         
        </div>
    )
};


export default GamesDisplay;




