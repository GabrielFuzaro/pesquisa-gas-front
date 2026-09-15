import { Injectable } from "@angular/core";
import { Cookies } from "typescript-cookie";

@Injectable({
  providedIn: 'root',
})
export class CookieService {

  constructor() {}

  setCookie(name: string, value: string) {
    Cookies.set(name, value);
  }

  getCookie(name: string){
    return Cookies.get(name)
  }

  deleteCookie(name: string){
    Cookies.remove(name);
  }
}