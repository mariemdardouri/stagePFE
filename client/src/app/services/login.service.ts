import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  
  url="http://localhost:3000/api/auth/login";
  constructor(private http:HttpClient) { }

  loginUser(data:any){
    return this.http.post(this.url, data).pipe(
      map((resp:any)=>{
        localStorage.setItem('token',resp.token);
        localStorage.setItem('role',resp.role);
        return resp
      })
    );
  }

}
