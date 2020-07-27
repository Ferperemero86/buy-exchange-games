import React from "react";
import {useRouter} from "next/router";

import Paragraph from "../../components/Paragraph";
import Div from "../../components/Div";
import Span from "../../components/Span";


const BasicUserInfo = ({nickName, userId}) => {
    const router = useRouter();
   
    const goToUserProfile = () => {
        router.push({
            pathname: "/account/user-profile", 
            query: {userId} 
        });
    }
    
    return (
        <Div className="basic-user-info" onClick={goToUserProfile}>
            <Div className="picture-name">
                <Span className="image" />
                <Paragraph
                    className="name"
                    text={nickName} />
            </Div>
        </Div>
    )
}

export default BasicUserInfo;
