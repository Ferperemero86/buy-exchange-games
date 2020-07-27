import React from "react";

const Paragraph = ({className, text, children}) => (
    <p className={className}>{children}{text}</p>
)

export default Paragraph;