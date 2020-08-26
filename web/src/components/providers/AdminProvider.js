import React, {createContext, useReducer, useMemo} from "react";
import {adminReducer} from "../../utils/reducers";

import {sendDataFromClient} from "../../utils/API";

export const AdminContext = createContext();


const AdminProvider = ({children, pageProps}) => {
    const {users} = pageProps;

    const initialValues = {
        users
    }

    const [adminState, dispatchAdmin] = useReducer(adminReducer, initialValues);

    const showDeleteQuestion = (e) => {
        e.preventDefault();

        const userId = parseInt(e.currentTarget.getAttribute("data"));
        dispatchAdmin({type: "SHOW_DELETE_QUESTION", payload: userId});
    }
    const hideDeleteQuestion = () => {
        dispatchAdmin({type: "SHOW_DELETE_QUESTION", payload: false});
    }
    const deleteUser = (userId) => {
        sendDataFromClient("/api/user/delete", {userId})
            .then(users => {
                console.log("USERS", users);
                dispatchAdmin({type: "UPDATE_USERS", payload: users});
            })
        hideDeleteQuestion();
    }

    const admin = useMemo(() => {
        return adminState
    }, [adminState])
       
    return <AdminContext.Provider value={{
        admin, 
        dispatchAdmin,
        deleteUser,
        showDeleteQuestion,
        hideDeleteQuestion
    }}>{children}</AdminContext.Provider>

}

export default AdminProvider;