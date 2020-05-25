module.exports = {
    userReducer: (state, action) => {
        switch(action.type) {
            case "USER_LOGGED_IN" :
                return {...state, userLogged: true}

            case "USER_LOGGED_OUT" :
                return {...state, userLogged: false}

            case "UPDATE_USER_ID" :
                return {...state, userId: action.payload}
        }
    },
    userFormReducer: (state, action) => {
        switch(action.type) {
            case "ADD_USERNAMEINPUT_VALUE" :
                return {...state, usernameInputValue: action.payload}

            case "ADD_PASSWORDINPUT_VALUE" :
                return {...state, passwordInputValue: action.payload}
        }
    },
    exploreGamesReducer: (state, action) => {
        switch(action.type) {
            case "UPDATE_GAMES" :
                return {...state, games: action.payload}

            case "UPDATE_PAGE" :
                return {...state, page: action.payload}
        }
    },
    gamesListReducer: (state, action) => {
        switch(action.type) {
            case "UPDATE_GAMES" :
                return {...state, games: action.payload}

            case "SHOW_GAME_MENU" :
                return {...state, showGameMenu: action.payload}

            case "SHOW_DELETE_LIST_QUESTION" :
                return {...state, showDeleteListQuestion: action.payload}

            case "SHOW_DELETE_GAME_QUESTION" :
                return {...state, showDeleteGameQuestion: action.payload}

            case "UPDATE_GAME_STATUS" :
                return {...state, gameStatus: action.payload}

            case "UPDATE_LIST_EXISTS" :
                return {...state, listExists: action.payload}

            case "SHOW_CREATE_LIST_INPUT" :
                return {...state, createListInput: true}

            case "HIDE_CREATE_LIST_INPUT" :
                return {...state, createListInput: false}

            case "SHOW_EDIT_LIST_ACTIVE_MENU" :
                return {...state, editListMenuActive: true}

            case "HIDE_EDIT_LIST_NAME" :
                return {...state, createListInput: false}

            case "SHOW_EDIT_LIST_NAME" :
                return {...state, editListMenuActive: true}

            case "HIDE_EDIT_LIST_ACTIVE_MENU" :
                return {...state, editListMenuActive: false}

            case "UPDATE_CREATE_LIST_INPUT_VALUE" :
                return {...state, createListInputValue: action.payload}

            case "UPDATE_LIST_NAME" :
                return {...state, listName: action.payload}

            case "HIDE_EDIT_LIST" :
                return {...state, editList: false}
            
            case "SHOW_EDIT_LIST" :
                return {...state, editList: true}

            case "SET_GAME_TO_DELETE" :
                return {...state, gameToDelete: action.payload}

            case "SET_ELEMENT_TO_DELETE" :
                return {...state, elementToDelete: action.payload}

            case "EDIT_NAME" :
                return {...state, editName: action.payload}
        }
    },
    transactionsReducer: (state, action) => {
        switch(action.type) {
            case "SET_GAME_FROM_LIST_TO_EXCHANGE" :
                return {...state, gameFromListToExchange: action.payload}

            case "SET_GAME_TO_EXCHANGE" :
                return {...state, gameToExchange: action.payload}

            case "SET_GAME_TO_FIND" :
                return {...state, gameToFind: action.payload}

            case "SHOW_EXCHANGE_SEARCH_WINDOW" :
                return {...state, showGameExchangeWindow: action.payload}

            case "SET_EXCHANGE_GAMES_SEARCH" :
                return {...state, exchangeGamesSearch: action.payload }
            
            case "SET_SEARCH_GAME_TO_EXCHANGE_INPUT_VALUE" :
                return {...state, searchGameToExchangeInputValue: action.payload}
        }
    },
    sellGameReducer: (state, action) => {
        switch(action.type) {
            case "UPDATE_GAME_PRICE" :
                return {...state, gamePrice: action.payload}

            case "UPDATE_GAME_DESCRIPTION" :
                return {...state, gameDescription: action.payload}
            
            case "UPDATE_GAME_CONDITION" :
                return {...state, gameCondition: action.payload}

            case "UPDATE_GAME_CURRENCY" :
                return {...state, gameCurrency: action.payload}
        }
    }
}