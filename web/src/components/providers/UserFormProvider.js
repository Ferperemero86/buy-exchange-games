import React, {useReducer, createContext, useMemo} from "react";

import {userFormReducer} from "../../utils/reducers";

export const UserFormContext = createContext(false);

const initialValues = {
    usernameInputValue: "",
    passwordInputValue: ""
}

const UserFormProvider = ({children}) => {
    const [userFormState, dispatchUserForm] = useReducer(userFormReducer, initialValues);

    const form = useMemo(() => {
        return userFormState
    }, [userFormState])

    return <UserFormContext.Provider value={{userForm: form, dispatchUserForm}}>{children}</UserFormContext.Provider>

}


export default UserFormProvider;