import {api} from "./api/index.js"
import {AuthorizationDataDto} from "./dtos/authorization-data.dto.js"
const client_secret = "HhIpMWkz3ssTUsZSg7zPlCRGOMAh23Phrx6LDWUv3SvqXvtlBHcErCfBtKYDLXig";

async function signIn(){
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const client_id = urlParams.get('client_id');
    const grant_type = "authorization_code";
    const redirect_uri = "https://emfi.shodon.ru/sign.html";

    if(!code || !client_id) {
        alert("Неизвестная ошибка при авторизации")
        window.location.replace("/auth.html");
        localStorage.clear()
        return;
    }

    const authDto = new AuthorizationDataDto({code, grant_type, client_id, redirect_uri, client_secret});
    const {refresh_token, access_token} = await api.getToken(authDto);
    localStorage.setItem("user", JSON.stringify({refresh_token, access_token}))

    window.location.replace("/index.html");

}
signIn();
