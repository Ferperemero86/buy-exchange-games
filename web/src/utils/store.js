import React, { useState } from "react";

export const StoreContext = React.createContext(null);

const Store = ({ children }) => {
    const [userId, setUserId] = useState(null);

    const [games, setGames] = useState([]);
    const [gamesList, setGamesList] = useState([]);
    const [page, setPage] = useState(1);
    const [platform, setPlatform] = useState("");

    const [createListInputValue, setCreateListInputValue] = useState("");
    const [createListInput, setCreateListInput] = useState(false);
    const [loginUsernameValue, setLoginUsernameValue] = useState("");
    const [loginPassValue, setLoginPassValue] = useState("");

    const [editListMenuActive, setEditListMenuActive] = useState(false);
    const [listCreated, setListCreated] = useState(false);
    const [listDeleted, setListDeleted] = useState(false);
    const [editList, setEditList] = useState(false);
    const [editName, setEditName] = useState(false);
    const [fetchGamesListFromServer, setFetchGamesListFromServer] = useState(true);
    const [gameID, setGameID] = useState(true);
    const [showGameMenu, setShowGameMenu] = useState(false);
    const [gamePrice, setGamePrice] = useState("");
    const [gameDescription, setGameDescription] = useState("");
    const [gameCondition, setGameCondition] = useState("Grade A");
    const [showGamePriceInput, setShowGamePriceInput] = useState(false);
    const [gameCurrency, setGameCurrency] = useState("£");

    const [inputValidation, setInputValidation] = useState(false);

    const [userLogged, setUserLogged] = useState(false);
    const [userCreated, setUserCreated] = useState(false);

    const [message, setMessage] = useState(false);
    const [gameListError, setGameListError] = useState(false);

    const [deleteElement, setDeleteElement] = useState(false);
    const [askDeleteList, setAskDeleteList] = useState(false);
    const [askDeleteGame, setAskDeleteGame] = useState(false);
    const [listName, setListName] = useState(false);

    const [currentPage, setCurrentPage] = useState(false);
    const [disabledButton, setDisabledButton] = useState("");
  
    //Reusable function to update state
    const updateState = (updateFunction) => {
        return (value) => {
            updateFunction(value)
        }
    };

    const store = {
        userId: userId,
        setUserId: updateState(setUserId),
        gameListError: gameListError,
        setGameListError: updateState(setGameListError),
        games: games,
        setGames: updateState(setGames),
        gameID: gameID,
        setGameID: updateState(setGameID),
        gamesList: gamesList,
        setGamesList: updateState(setGamesList),
        fetchGamesListFromServer: fetchGamesListFromServer,
        setFetchGamesListFromServer: updateState(setFetchGamesListFromServer),
        page: page,
        setPage: updateState(setPage),
        platform: platform,
        setPlatform: updateState(setPlatform),
        createListInputValue: createListInputValue,
        setCreateListInputValue: updateState(setCreateListInputValue),
        createListInput: createListInput,
        setCreateListInput: updateState(setCreateListInput),
        loginUsernameValue: loginUsernameValue,
        setLoginUsernameValue: updateState(setLoginUsernameValue),
        loginPassValue: loginPassValue,
        setLoginPassValue: updateState(setLoginPassValue),
        userCreated: userCreated,
        setUserCreated: updateState(setUserCreated),
        editListMenuActive: editListMenuActive,
        setEditListMenuActive: updateState(setEditListMenuActive),
        listCreated: listCreated,
        listDeleted: listDeleted,
        setListDeleted: updateState(setListDeleted),
        setListCreated: updateState(setListCreated),
        showGameMenu: showGameMenu,
        setShowGameMenu: updateState(setShowGameMenu),
        gamePrice: gamePrice,
        setGamePrice: updateState(setGamePrice),
        gameCurrency: gameCurrency,
        setGameCurrency: updateState(setGameCurrency),
        gameCondition: gameCondition,
        setGameCondition: updateState(setGameCondition),
        gameDescription: gameDescription,
        setGameDescription: updateState(setGameDescription),
        showGamePriceInput: showGamePriceInput,
        setShowGamePriceInput: updateState(setShowGamePriceInput),
        editList: editList,
        setEditList: updateState(setEditList),
        editName: editName,
        setEditName: updateState(setEditName),
        inputValidation: inputValidation,
        setInputValidation: updateState(setInputValidation),
        userLogged: userLogged,
        setUserLogged: updateState(setUserLogged),
        message: message,
        setMessage: updateState(setMessage),
        deleteElement: deleteElement,
        setDeleteElement: updateState(setDeleteElement),
        askDeleteList: askDeleteList,
        setAskDeleteList: updateState(setAskDeleteList),
        askDeleteGame: askDeleteGame,
        setAskDeleteGame: updateState(setAskDeleteGame),
        listName: listName,
        setListName: updateState(setListName),
        currentPage: currentPage,
        setCurrentPage: updateState(setCurrentPage),
        disabledButton: disabledButton,
        setDisabledButton: setDisabledButton
    };

    return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
};

export default Store;