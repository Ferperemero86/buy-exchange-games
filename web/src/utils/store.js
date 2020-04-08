import React, { useState } from "react";

export const StoreContext = React.createContext(null);

const Store = ({ children }) => {

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
    const [editList, setEditList] = useState(false);
    const [editName, setEditName] = useState(false);

    const [inputValidation, setInputValidation] = useState(false);

    const [userLogged, setUserLogged] = useState(false);
    const [userCreated, setUserCreated] = useState(false);

    const [message, setMessage] = useState(false);
    const [gameListError, setGameListError] = useState(false);

    const [deleteElement, setDeleteElement] = useState(false);
    const [askDelete, setAskDelete] = useState(false);
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
        gameListError: gameListError,
        setGameListError: updateState(setGameListError),
        games: games,
        setGames: updateState(setGames),
        gamesList: gamesList,
        setGamesList: updateState(setGamesList),
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
        setListCreated: updateState(setListCreated),
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
        askDelete: askDelete,
        setAskDelete: updateState(setAskDelete),
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