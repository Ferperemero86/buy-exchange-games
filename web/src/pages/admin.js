import React, {useContext, useEffect} from "react";
import {useRouter} from "next/router";
import {AdminContext} from "../components/providers/AdminProvider";
import {getLocalData} from "../utils/API";

import Label from "../components/Label";
import Button from "../components/forms/Button";
import Heading from "../components/Heading";
import ListElement from "../components/ListElement";
import List from "../components/List";
import DeleteQuestion from "../components/messages/DeleteQuestion";

export async function getServerSideProps(ctx) {
    const userId = ctx.req.user ? ctx.req.user.id : null;
    const isAdmin = ctx.req.user ? ctx.req.user.isAdmin : null;
    const URLBase = ctx.req.headers.host;
    const usersUrl = new URL("/api/users", `http://${URLBase}`).href;

    const users = await getLocalData(usersUrl);

    if (!userId) { 
        return { props: {login: false} } 
    }

    return { props: {users,isAdmin} }
}

const Headers = () => {
    return(
        <List className="headers">
            <ListElement className="header-element">Id</ListElement>
            <ListElement className="header-element">Email</ListElement>
        </List>
    )
}

const UserField = ({user}) => {
    const {id, email} = user;
    const {admin, deleteUser, showDeleteQuestion, hideDeleteQuestion} = useContext(AdminContext);
    const {deleteQuestion} = admin;
    
    return(
        <div className="user-field">
            <Label text={id} />
            <Label text={email} />
            {deleteQuestion === id 
             && <DeleteQuestion
                 element="user"
                 action={deleteUser}
                 cancelDelete={hideDeleteQuestion}
                 userId={id} />}
            <Button 
             text="Delete" 
             data={id}
             onClick={showDeleteQuestion} />
            <Button 
             text="Profile" 
             data={id}
             onClick={deleteUser} />
        </div>
    )
}

const Users = () => {
    const {admin} = useContext(AdminContext);
    const {users} = admin;
    const usersList = users.users;
    
    if (usersList.length > 0) {
        return usersList.map(user => {
            return <UserField 
                    user={user} 
                    key={user.id} />
        })
    }
    return null;
}

const UsersTable = () => {
    return (
        <div className="users-table">
            <Headers />
            <Users />
        </div>
    )
}

const Admin = ({login, isAdmin}) => {
    const {admin} = useContext(AdminContext);
    const {users} = admin;
    const router = useRouter();
    
    useEffect(() => {
        if (login === false) {
            router.push("/account/login");
        }
        if (login !== false && !isAdmin) {
            router.push("/");
        }
    }, []);

    return (
        <div className="admin-area">
            <Heading
             type="h1"
             text="Admin" />
            {users && <UsersTable />}
        </div>
    )
}

export default Admin;