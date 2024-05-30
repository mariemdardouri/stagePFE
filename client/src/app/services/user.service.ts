import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable, catchError, map, throwError } from 'rxjs';

const URL ="http://localhost:3000/api/user/";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http:HttpClient) { }
  
  getAllUser(): Observable<any[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token introuvable');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any>(URL + 'get-all-users', { headers }).pipe(
      map(response => response.data)
    );
  }
  getUserProfile(): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token introuvable');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any>(URL + 'get-user-profile', { headers });
  }

  updateUser(user: any): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token introuvable');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.put(URL + 'update-user/' + user._id, user, { headers });
  }

  updateProfile(user: any): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token introuvable');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.put(URL+'update-profile', user, { headers });
  }
  updateUserStatus(user: any): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token introuvable');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.put<any>(URL + 'user-activate/' + user._id, user, {headers});
  }
  
  activateUser(user: any): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token introuvable');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.put<any>(URL + 'user-activate/' + user._id , user, {headers});
  }
  desactivateUser(user: any): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token introuvable');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.put<any>(URL + 'desactivate-user/' + user._id , user, {headers});
  }

  getAgentsWithRole(): Observable<any[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token introuvable');
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any[]>(URL + 'get-users-by-role', { headers });
  }
}
