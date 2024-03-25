
export const setUserInfo = ( accessToken ) => {
    return setLocalStorage("authKey", accessToken);
}

export const getUserInfo = () => {
    const authToken = getFromLocalStorage("authKey");
    if (authToken) {
        return authToken
    } else {
        return null
    }
    // return getFromLocalStorage("authKey");
}
export const isLoggedIn = () => {
    const authToken = getFromLocalStorage("authKey");
    return !!authToken;
}
export const loggedOut = () => {
    return localStorage.removeItem("authKey")
}

const setLocalStorage = (key, token) => {
    if (!key || typeof window === 'undefined') {
        console.log("error in setting storage")
        return ''
    }
    return localStorage.setItem(key, token)
}

const getFromLocalStorage = (key) => {
    if (!key || typeof window === 'undefined') {
        return ''
    }
    return localStorage.getItem(key)
}