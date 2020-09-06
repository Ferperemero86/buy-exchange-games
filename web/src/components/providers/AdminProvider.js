import React, {createContext, useReducer, useMemo, useEffect} from "react";
import {adminReducer} from "../../utils/reducers";
import {useRouter} from "next/router";

import {sendDataFromClient} from "../../utils/API";

export const AdminContext = createContext();


const AdminProvider = ({children, pageProps}) => {
    const {login, isAdmin} = pageProps;
    const {users} = pageProps;
    const router = useRouter();
    const initialValues = {
        users,
        isAdmin
    }

    const [adminState, dispatchAdmin] = useReducer(adminReducer, initialValues);

    const showDeleteQuestion = (e) => {
        e.preventDefault();

        const userId = parseInt(e.currentTarget.getAttribute("data"));
        dispatchAdmin({type: "SHOW_DELETE_QUESTION", payload: userId});
    };

    const hideDeleteQuestion = () => {
        dispatchAdmin({type: "SHOW_DELETE_QUESTION", payload: false});
    };

    const deleteUser = (userId) => {
        sendDataFromClient("/api/user/delete", {userId})
            .then(users => {
                if (users.authError) { return router.push("/not-authorised")}
                dispatchAdmin({type: "UPDATE_USERS", payload: users});
            })
            .catch(err => {
                console.log("ERROR", err);
            })
        hideDeleteQuestion();
    };

    const admin = useMemo(() => {
        return adminState
    }, [adminState]);

    useEffect(() => {
        if (login === false) {
            router.push("/account/login");
        }
        if (login !== false && !isAdmin) {
            router.push("/not-authorised");
        }
    })
       
    return <AdminContext.Provider value={{
        admin, 
        dispatchAdmin,
        deleteUser,
        showDeleteQuestion,
        hideDeleteQuestion
    }}>{children}</AdminContext.Provider>

}

export default AdminProvider;