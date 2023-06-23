const getFrom = (texts, userLang) => {

    let choseLang
    for(let j = 0; j < texts.length; j++) {
        if (userLang == texts[j].lang) {
            choseLang = texts[j].body
            break
        }
    }
    if (choseLang == undefined) {
        choseLang = texts[0].body
    }

    return choseLang

}

export default getFrom