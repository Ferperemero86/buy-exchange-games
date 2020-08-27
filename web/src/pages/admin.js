import React, {useContext, useEffect} from "react";
import {useRouter} from "next/router";
import {AdminContext} from "../components/providers/AdminProvider";
import {getLocalData} from "../utils/API";

import Link from "next/link";
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
            <ListElement className="header-element id">Id</ListElement>
            <ListElement className="header-element email">Email</ListElement>
        </List>
    )
}

const UserField = ({user}) => {
    const {id, email} = user;
    const {admin, deleteUser, showDeleteQuestion, hideDeleteQuestion} = useContext(AdminContext);
    const {deleteQuestion} = admin;
    
    return(
        <List className="user-field">
            <ListElement className="user-field-element id">
                <Label 
                 text={id} 
                 className="label" />
            </ListElement>
            <ListElement className="user-field-element email">
                <Label
                 text={email} 
                 className="label" />
            </ListElement>
            <ListElement className="user-field-element">
                {deleteQuestion === id 
                 && <DeleteQuestion
                     element="user"
                     action={deleteUser}
                     cancelDelete={hideDeleteQuestion}
                     userId={id} />}
            </ListElement>
            <ListElement className="user-field-element button">
                <Button 
                 text="Delete" 
                 className="button"
                 data={id}
                 onClick={showDeleteQuestion} />
            </ListElement>
            <ListElement className="user-field-element profile">
                <Link
                  href={{ 
                    pathname: "/account/user-profile", 
                    query: {userId: id} 
                  }}>
                    <a className="profile-link">Profile</a>
                 </Link>
            </ListElement>  
        </List>
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
             className="heading"
             text="Admin" />
            {users && <UsersTable />}
        </div>
    )
}

export default Admin;