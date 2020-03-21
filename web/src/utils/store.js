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
    const [editList, setEditList] = useState(false);
    const [editName, setEditName] = useState(false);

    const [inputValidation, setInputValidation] = useState(false);

    const [userLogged, setUserLogged] = useState(false);

    const [messageSuccess, setMessageSuccess] = useState(false);

    const [deleteElement, setDeleteElement] = useState(false);
    const [askDelete, setAskDelete] = useState(false);
    const [listName, setListName] = useState(false);



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
        },
        editList: editList,
        setEditList: (value) => {
            setEditList(value);
        },
        editName: editName,
        setEditName: (value) => {
            setEditName(value);
        },
        inputValidation: inputValidation,
        setInputValidation: (value) => {
            setInputValidation(value);
        },
        userLogged: userLogged,
        setUserLogged: (value) => {
            setUserLogged(value);
        },
        messageSuccess: messageSuccess,
        setMessageSuccess: (value) => {
            setMessageSuccess(value);
        },
        deleteElement: deleteElement,
        setDeleteElement: (value) => {
            setDeleteElement(value);
        },
        askDelete: askDelete,
        setAskDelete: (value) => {
            setAskDelete(value);
        },
        listName: listName,
        setListName: (value) => {
            setListName(value);
        }
    };

    return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
};