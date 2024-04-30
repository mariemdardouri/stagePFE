
  import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
  import { Injectable } from '@angular/core';
  import { jwtDecode } from 'jwt-decode';
  import { Observable, catchError, map } from 'rxjs';

  const URL ="http://localhost:3000/api/materiel/";

  @Injectable({
    providedIn: 'root'
  })
  export class MaterielService {

    constructor(private http:HttpClient) { }

    addMateriel(data:any){
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }

      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
      });
      return this.http.post(URL + 'add-materiel',data,{headers});

    }
    

    getMateriels(): Observable<any[]>  {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
      });
      return this.http.get<any>(URL + 'get-materiel' , { headers }).pipe(
        map(response => response.materiel)
      );
    }

    updateMateriel(materiel: any): Observable<any> {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }

      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
      });

      return this.http.put(URL + 'update-materiel/' + materiel._id, materiel, { headers });
    }

    deleteMateriel(materiel: any): Observable<any> {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }

      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
      });

      return this.http.delete(URL + 'delete-materiel/' + materiel._id, { headers }).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            // Handle unauthorized error
            console.error('Unauthorized: ', error.message);
            throw new Error('Unauthorized');
          } else {
            // Handle other errors
            console.error('Error deleting materiel: ', error.message);
            throw new Error('An error occurred while deleting the materiel');
          }
        })
      );
    }

  }
