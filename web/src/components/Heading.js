import React from "react";

const Heading = ({type, className, text}) => {
    
    switch(type) {
        case "h1" :
            return <h1 className={className}>{text}</h1>;
        
        case "h2" :
            return <h2 className={className}>{text}</h2>;

        case "h3" :
            return <h3 className={className}>{text}</h3>;

        default :
            return null;
    }
}

export default Heading;