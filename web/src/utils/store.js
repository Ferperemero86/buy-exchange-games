import React, { useState } from "react";

export const StoreContext = React.createContext(null);

export default ({ children }) => {

    const [games, setGames] = useState([]);
    const [recentGamesLink, setRecentGamesLink] = useState("all-games-link-styles");
    const [allGamesLink, setAllGamesLink] = useState("");
    const [content, setContent] = useState("");
    const [gamesIndex, setGamesIndex] = useState(0);

    const [gameName, setGameName] = useState(null);
    const [gameDetails, setGameDetails] = useState([]);
    const [selectedIndexClass, setSelectedIndexClass] = useState("");

    const [createListInputValue, setCreateListInputValue] = useState("");
    const [loginUsernameValue, setLoginUsernameValue] = useState("");
    const [loginPassValue, setLoginPassValue] = useState("");

    const [gameToBeaddedId, setGameToBeAddedId] = useState("");

    const [gamesList, setGamesList] = useState([]);
    const [editListMenuActive, setEditListMenuActive] = useState(false);
    const [listCreated, setListCreated] = useState(false);
    const [listExists, setListExists] = useState(false);



    const store = {
        games: games,
        setGames: (value) => {
            setGames(value)
        },
        recentGamesLink: recentGamesLink,
        setRecentGamesLink: (value) => {
            setRecentGamesLink(value)
        },
        allGamesLink: allGamesLink,
        setAllGamesLink: (value) => {
            setAllGamesLink(value)
        },
        content: content,
        setContent: (value) => {
            setContent(value)
        },
        gamesIndex: gamesIndex,
        setGamesIndex: (value) => {
            setGamesIndex(value)
        },
        gameName: gameName,
        setGameName: (value) => {
            setGameName(value)
        },
        gameDetails: gameDetails,
        setGameDetails: (value) => {
            setGameDetails(value)
        },
        selectedIndexClass: selectedIndexClass,
        setSelectedIndexClass: (value) => {
            setSelectedIndexClass(value)
        },
        createListInputValue: createListInputValue,
        setCreateListInputValue: (value) => {
            setCreateListInputValue(value);
        },
        loginUsernameValue: loginUsernameValue,
        setLoginUsernameValue: (value) => {
            setLoginUsernameValue(value)
        },
        loginPassValue: loginPassValue,
        setLoginPassValue: (value) => {
            setLoginPassValue(value)
        },
        gameToBeaddedId: gameToBeaddedId,
        setGameToBeAddedId: (value) => {
            setGameToBeAddedId(value);
        },
        gamesList: gamesList,
        setGamesList: (value) => {
            setGamesList(value);
        },
        editListMenuActive: editListMenuActive,
        setEditListMenuActive: (value) => {
            setEditListMenuActive(value);
        },
        listCreated: listCreated,
        setListCreated: (value) => {
            setListCreated(value);
        }
    };

    return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
};