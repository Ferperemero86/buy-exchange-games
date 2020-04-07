import React from "react";

const ValidationError = ({ inputValidation }) => {
    if (inputValidation) {
        return Object.keys(inputValidation).map((key, index) => {
            return (
                <div
                    className="validation-error-message"
                    key={key} >
                    {inputValidation[key]}
                </div>
            )
        })
    }
    return null;
}

export default ValidationError;