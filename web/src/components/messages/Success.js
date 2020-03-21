import React from "react";

const SuccessMessage = ({message, elementClass}) => {
    if(message) {
        return (
            <div className={`success-message ${elementClass}`}>
                {message}
            </div>
        )
    }
    return null;
};

export default SuccessMessage;