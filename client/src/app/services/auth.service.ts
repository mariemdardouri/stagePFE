import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {  map } from 'rxjs/operators';
import {  Observable, of, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { UserInfo } from 'os';

const URL ="http://localhost:3000/api/auth/";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private Authenticated = false;
   
  constructor(private http:HttpClient) { }

  isAuthenticated(): boolean {
    return this.Authenticated;
  }

  loginUser(data:any){
    return this.http.post(URL + 'login', data).pipe(
      map((resp:any)=>{
        localStorage.setItem('token',resp.token);
        localStorage.setItem('role',resp.role);
        this.Authenticated = true;
        return resp;
      })
    );
  }
  registerUser(data:any){
    return this.http.post(URL + 'register',data);
  }
  
  
  getUserInfo(): Observable<any>{
    const token = localStorage.getItem('token');
    console.log(token);
    if(!token){
      return throwError('token not fount');
      }

    try{
     const headers =  ({
        Authorization:`Bearer ${token}`
      })
      const decodedToken = jwtDecode(token);
      const userId = decodedToken;
      console.log(userId,'ssss');
      console.log(headers,'hhhhh');
      return this.http.post(URL+ 'get-user-info',{},{headers});
    }catch(error){
      console.error(error);
      console.log(error,'error');
      return throwError('invalid token');
    };
  }
  
  }
  


