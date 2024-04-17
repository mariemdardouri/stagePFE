import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url="http://localhost:3000/api/user/get-user-info-by-role";
  constructor(private http:HttpClient) { }

  getUser(role: any){  
    return this.http.post(this.url, role);
  }
}
