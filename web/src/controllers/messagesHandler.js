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
        msg.push("Password and username does not match")
    }

    if (response.nickNameExists) {
        msg.push("Nickname taken")
    }

    if (response.userExists) {
        msg.push("User already exists")
    }


    return msg;
}