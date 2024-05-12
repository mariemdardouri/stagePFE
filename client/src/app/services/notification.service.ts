import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const URL ="http://localhost:3000/api/user/";
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) {}

  getUserNotifications(): Observable<any> {
    const token = localStorage.getItem('token');
    console.log(token, 'ttttttttttttttt');
    if (!token) {
      throw new Error('Token not found');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any>(URL + 'user-notifications', { headers });
  }
}
