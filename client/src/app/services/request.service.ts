import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

const URL = 'http://localhost:3000/api/admin/';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  constructor(private http: HttpClient) {}

  addRequest(data:any){
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token introuvable');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.post(URL + 'add-request',data,{headers});

  }

  uploadCSV(file: File, userId: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('id', userId);

    const token = localStorage.getItem('token')

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(URL+ 'uploadCSV', formData, { headers });
  }
  getRequestByResponsableSite(): Observable<any[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token introuvable');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http
      .get<any>(URL + 'get-requests-by-responsable-site', { headers })
      .pipe(map((response) => response.requests));
  }

  getAllRequest(): Observable<any[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token introuvable');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http
      .get<any>(URL + 'get-all-requests', { headers })
      .pipe(map((response) => response.data));
  }

  updateRequest(request: any): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token introuvable');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.put(URL + 'update-request/' + request._id, request, { headers });
  }

  deleteRequest(request: any): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token introuvable');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.delete(URL + 'delete-request/' + request._id, { headers });
  }
  acceptUserRequest(user: any): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token introuvable');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.put<any>(URL + 'accept-user/' + user._id, user, { headers });
  }
  rejectRequest(request: any): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token introuvable');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.put<any>(URL + 'reject-request/' + request._id, request, { headers });
  }
}
