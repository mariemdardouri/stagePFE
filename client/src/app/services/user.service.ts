import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable, map } from 'rxjs';

const URL ="http://localhost:3000/api/user/";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http:HttpClient) { }
  
  getAllUser(): Observable<any[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any>(URL + 'get-all-users', { headers }).pipe(
      map(response => response.data)
    );
  }


  updateUser(user: any): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.put(URL + 'update-user/' + user._id, user, { headers });
  }

}
