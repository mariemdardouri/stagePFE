import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable, catchError, map } from 'rxjs';

const URL ="http://localhost:3000/api/mission/";

@Injectable({
  providedIn: 'root'
})
export class MissionService {

  constructor(private http:HttpClient) { }

  addMission(data:any){
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.post(URL + 'add-mission',data,{headers});

  }
  

  getMissions(): Observable<any[]>  {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get<any>(URL + 'get-mission' , { headers }).pipe(
      map(response => response.mission)
    );
  }

  updateMission(mission: any): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.put(URL + 'update-mission/' + mission._id, mission, { headers });
  }

  deleteMission(mission: any): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.delete(URL + 'delete-mission/' + mission._id, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Handle unauthorized error
          console.error('Unauthorized: ', error.message);
          throw new Error('Unauthorized');
        } else {
          // Handle other errors
          console.error('Error deleting mission: ', error.message);
          throw new Error('An error occurred while deleting the mission');
        }
      })
    );
  }

}
