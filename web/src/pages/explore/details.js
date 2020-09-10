import React from "react";
import Link from "next/link";
import {sendDataFromClient, fetchApiData} from "../../utils/API";

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowCircleLeft} from '@fortawesome/free-solid-svg-icons';

import Heading from "../../components/Heading";
import List from "../../components/List";
import ListElement from "../../components/ListElement";
import Image from "../../components/Image";
import Paragraph from "../../components/Paragraph";
import Anchor from "../../components/Anchor";


export async function getServerSideProps ({query}) {
    const gameId = query ? query.id : null;
    const platform = query ? query.platform : null;
    let platformQuery;

    switch (platform) {
        case "ps4" :
            platformQuery = "48";

        break;

        case "xbox" :
            platformQuery = "49";
            
        break;

        case "pc" :
            platformQuery = "6";
            
        break;
    }
    
    const game = await fetchApiData("games", "POST", `fields name, summary, cover.url; where id = ${gameId} & platforms = ${platformQuery};`);
   
    if (game.length > 0 && game[0].status === 400 || game.length === 0) { return {props: {game: false} } }

    return {props: {game: game[0], platform}}
}

const Header = ({title}) => (
    <div className="header">
        <Heading 
         className="title"
         type="h2"
         text={title} />
    </div>
);

const Cover = ({cover}) => {
    return (
        <div className="cover-container">
            {cover && <Image 
             Url={`${cover}`} 
             className="cover" />}
            {!cover && 
             <Paragraph className="details-no-image-available">No image Available</ Paragraph>}
        </div>
    )
};

const Links = ({query, addToList}) => (
    <div className="links">
        <List className="links-list">
            <ListElement 
             className="link"
             onClick={addToList}>Add to list</ListElement>
            <ListElement className="link">
                <Link href={{ pathname: `/games/users-selling`, 
                              query: { id: query.id} }}>
                       <a href=""
                          className="details-buy-link">Buy</a>
                </Link>
            </ListElement>
            <ListElement className="link">Exchange</ListElement>
        </List>
    </div>
);

const Summary = ({summary}) => (
    <Paragraph 
     className="summary" 
     text={summary} />
);

const Details = ({game, platform}) => {
    const id = game ? game.id : null;
    const page = game ? game.page : null;
    const title = game ? game.name : null;
    const summary = game ? game.summary : null;
    let cover;
    if (!game) { return <Heading 
                         text="Game Does not exist"
                         className="details-games-does-not-exist"
                         type="h1" />}
    
    if (game.cover) {
        const coverString = game.cover.url;
        cover = coverString.replace("t_thumb", "t_screenshot_med");
    } else {
        cover = false;
    }

    const addToList = () => {
        const gameData = game;
        gameData["platform"] = platform;
       
        sendDataFromClient("/api/gamesinlist/game/add", {game: gameData})
            .then(result => {
                console.log("GAME ADDED", result)
            })
            .catch(err => {
                console.log("ERROR", err);
            })
    };

    if (Object.keys(game).length > 0) {
        return (
            <div className="game-details" key={id}>
                <Header 
                 platform={platform} 
                 page={page}
                 title={title} />
                <Cover
                 cover={cover}/>
                <Links 
                 query={game}
                 addToList={addToList} />
                <Summary 
                 summary={summary} />
            </div>
        )
    }
    return (
        <div className="no-game-selected">
            <Heading 
             className="heading"
             text="No Game Selected" />
            <FontAwesomeIcon 
             icon={faArrowCircleLeft} 
             className="left-arrow" />
            <Link href="/">
                <Anchor 
                 Url="/" 
                 className="go-back-link">Go Back</Anchor>
            </Link>
        </div>
    )
};

export default Details;

