
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable, map } from 'rxjs';

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
    const headers = ({
      Authorization: `Bearer ${token}`
    });
    return this.http.get<any>(URL + 'get-materiel' , { headers }).pipe(
      map(response => response.materiel)
    );
  }

}
