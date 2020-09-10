import React, {useContext} from "react";
import Link from "next/link";
import {SettingsContext} from "../../components/providers/SettingsProvider";

import Label from "../../components/Label";
import Input from "../../components/forms/Input";
import Button from "../../components/forms/Button";
import DeleteQuestion from "../../components/messages/DeleteQuestion";
import Heading from "../../components/Heading";

export async function getServerSideProps(ctx) {
    const userId = ctx.query.id ? ctx.query.id : null;
    const userLogged = ctx.req.user ? ctx.req.user.id : null;
    
    if (!userLogged) { return { props: {login: false} } }

    return { props: {userId, userLogged} }
}

const PasswordField = () => {
    const {settings, updatePassword, updatePasswordInput} = useContext(SettingsContext);
    const {passwordInput} = settings;

    return (
        <div className="password-field field">
            <Label 
             className="label"
             text="Edit Password" />
            <Input 
             type="password" 
             onChange={updatePasswordInput} />
            <Button 
             text="Save"
             className="button"
             data={passwordInput}
             onClick={updatePassword} />
        </div>
    )
}

const DeleteAccountLink = () => {
    const {showDeleteQuestion} = useContext(SettingsContext);

    return (
        <Link href="/">
            <a className="settings-delete-account field"
               onClick={showDeleteQuestion}>Delete Account</a>
        </Link>
    )
}

const Settings = ({userLogged}) => {
    const {settings, deleteAccount, hideDeleteQuestion} = useContext(SettingsContext);
    const {deleteQuestion} = settings;

    if (!userLogged) { return null }

    return (
        <div className="settings">
            <Heading
             text="Settings"
             className="settings-heading"
             type="h1" />
            <PasswordField />
            {deleteQuestion && <DeleteQuestion 
             element="account"
             cancelDelete={hideDeleteQuestion}
             action={deleteAccount} />}
            <DeleteAccountLink />
        </div>
    )
}

export default Settings;