import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn= false;
  url="http://localhost:3000/api/auth/login";
  constructor(private http:HttpClient) { }

  loginUser(data:any){
    return this.http.post(this.url, data).pipe(
      map((resp:any)=>{
        localStorage.setItem('token',resp.token);
        localStorage.setItem('role',resp.role);
        this.loggedIn = true;
        return resp;
      })
    );
  }

  isLoggedIn():boolean{
    return this.loggedIn;
  }

  getUserRole():string{
    return localStorage.getItem('role') || '';
  }
}

