module.exports = function handleMessages(response) {
    let msg = [];
    console.log(response);
    if (response.inputValidation) {
        const {inputValidation} = response;
        const {country, nickName} = inputValidation;

        if (country) {
            msg.push(country[0]);
        }
        if (nickName) {
            msg.push(nickName[0]);
        }
    }

    if (response.login === false) {
        msg.push({text:"Password and username does not match", classNam: ""});
    }

    if (response.nickNameExists) {
        msg.push({text: "Nickname taken", classNam: ""});
    }

    if (response.userExists) {
        msg.push({text: "User already exists", classNam: ""});
    }

    if (response.locationsEmpty) {
        msg.push({text: "Select a location to see games", classNam: "select-location-text"});
    }


    return msg;
}