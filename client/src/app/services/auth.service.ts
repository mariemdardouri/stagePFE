import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {  map } from 'rxjs/operators';
import {  Observable, of, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { UserInfo } from 'os';
import { ToastrService } from 'ngx-toastr';

const URL ="http://localhost:3000/api/auth/";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private Authenticated = false;
   
  constructor(private http:HttpClient, private toast: ToastrService) { }

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
      
      
      console.log(headers,'hhhhh');
      return this.http.post(URL+ 'get-user-info',{},{headers});
    }catch(error){
      console.error(error);
      console.log(error,'error');
      this.toast.error('This account is deactivated');
      return throwError('invalid token');
    };
  }
  getDecodedToken(token: string): any {
    return jwtDecode(token);
  }
  }
  


