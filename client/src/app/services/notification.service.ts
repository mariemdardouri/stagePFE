import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map } from 'rxjs';

const URL ="http://localhost:3000/api/user/";
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private unseenNotificationsCount = new BehaviorSubject<number>(0);
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

  getUserNotificationsCount(): Observable<number> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<{ unseenNotificationsCount: number; success: boolean }>(URL + 'user-notifications-count', { headers }).pipe(
      map(response => response.unseenNotificationsCount)
    );
  }

  
  setUnseenNotificationsCount(count: number): void {
    this.unseenNotificationsCount.next(count);
  }

  getUnseenNotificationsCount(): Observable<number> {
    return this.unseenNotificationsCount.asObservable();
  }
  
  markAllAsSeen(user:any): Observable<any> {
    const token = localStorage.getItem('token');
    console.log(token, 'ttttttttttttttt');
    if (!token) {
      throw new Error('Token not found');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<any>(URL + 'mark-all-notifications-as-seen',user, { headers });
  }
  deleteAllNotifications(user:any): Observable<any> {
    const token = localStorage.getItem('token');
    console.log(token, 'ttttttttttttttt');
    if (!token) {
      throw new Error('Token not found');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<any>(URL + 'delete-all-notifications',user, { headers });
  }
  
}
