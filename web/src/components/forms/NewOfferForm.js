import React from "react";

import Input from "./Input";
import Label from "./Label";

const NewOfferForm = ({newOfferForm, price, currency, onChange, value}) => {
    if (newOfferForm) {
        return (
            <div>
                <Input
                    type="number"
                    name="price-input"
                    placeholder={value}
                    onChange={onChange}
                    className="price-input" />
                <Label 
                    className="label"
                    text={currency} />
            </div>
        )
    }
    return <p>Price: {price}{currency}</p>
}

export default NewOfferForm;