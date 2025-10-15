import jwtDecode from "jwt-decode";
import authService from "./authService";
import Config from "../config/loginApi.json";

export function login(account) {
  return authService.post(Config.loginApi, account);
}

export function saveJwt(jwt, prefix) {
  console.log(prefix);
  localStorage.setItem(`token-${prefix}`, jwt);
}

export function getJwt(prefix) {
  return localStorage.getItem(`token-${prefix}`);
}

export function getUser(email) {
  try {
    let data = jwtDecode(localStorage.getItem(`token-${email}`));
    // return data;
    console.log(data);
  } catch (error) {
    return null;
  }
}

export function decodeJwt(jwt) {
  try {
    let data = jwtDecode(jwt);
    return data;
  } catch (error) {
    return null;
  }
}
