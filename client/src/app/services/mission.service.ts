import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable, catchError, map } from 'rxjs';
import { AuthService } from './auth.service';

const URL = 'http://localhost:3000/api/mission/';

@Injectable({
  providedIn: 'root',
})
export class MissionService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  addMission(data: any): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const userId = this.authService.getUserId(); // Get the logged-in user's ID
    const missionData = { ...data, assignedTo: userId }; // Assign the mission to the logged-in user

    return this.http.post(URL + 'add-mission', missionData, { headers });
  }

  getMissions(): Observable<any[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http
      .get<any>(URL + 'get-mission', { headers })
      .pipe(map((response) => response.mission));
  }

  getAgents(): Observable<any[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(URL + '/get-user', { headers });
  }

  updateMission(mission: any): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.put(URL + 'update-mission/' + mission._id, mission, {
      headers,
    });
  }
  rejectMission(mission: any): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.put(URL + 'reject-mission/' + mission._id, mission, {
      headers,
    });
  }
  validMission(mission: any): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.put(URL + 'valider-mission/' + mission._id, mission, {
      headers,
    });
  }
  
  deleteMission(mission: any): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http
      .delete(URL + 'delete-mission/' + mission._id, { headers })
      .pipe(
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

  getUserMissions(): Observable<any[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token introuvable');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const user = this.authService.getLoggedInUser(); // Get the logged-in user's full name
    const fullName = `${user.firstName} ${user.lastName}`;

    return this.http.get<any[]>(URL + 'missions', { headers });
  }
}
