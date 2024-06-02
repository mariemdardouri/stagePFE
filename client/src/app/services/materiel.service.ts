
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
        throw new Error('Token introuvable');
      }

      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
      });
      return this.http.post(URL + 'add-materiel',data,{headers});

    }
    

    getMateriels(): Observable<any[]>  {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token introuvable');
      }
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
      });
      return this.http.get<any>(URL + 'get-materiel' , { headers }).pipe(
        map(response => response.materiel)
      );
    }

    getMaterielByFournisseur(): Observable<any[]>  {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token introuvable');
      }
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
      });
      return this.http.get<any>(URL + 'get-materiel-by-fournisseur' , { headers }).pipe(
        map(response => response.materiel)
      );
    }

    updateMateriel(materiel: any): Observable<any> {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token introuvable');
      }

      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
      });

      return this.http.put(URL + 'update-materiel/' + materiel._id, materiel, { headers });
    }

    addNumInv(materiel: any): Observable<any> {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token introuvable');
      }

      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
      });

      return this.http.put(URL + 'add-numInv/' + materiel._id, materiel, { headers });
    }
    getLotNumbers(): Observable<number[]> {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token introuvable');
      }
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
      });
      return this.http.get<number[]>(URL + 'lotNumbers',{headers});
    }

    updateCheckedMateriels(materiels: any[]): Observable<any> {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token introuvable');
      }
    
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
    
      const checkedMateriels = materiels.filter(materiel => materiel.checked);
    
      return this.http.put(URL + 'accept-materiels', checkedMateriels, { headers });
    }

    rejectMateriels(materiels: any[]): Observable<any> {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token introuvable');
      }
    
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
    
      const materielsIds = materiels.map(materiel => materiel._id);
    
      return this.http.put(URL + 'reject-materiels', materielsIds, { headers });
    }
    deleteMateriel(materiel: any): Observable<any> {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token introuvable');
      }

      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
      });

      return this.http.delete(URL + 'delete-materiel/' + materiel._id, { headers });
    }

    affectMateriel(materiel: any): Observable<any> {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token introuvable');
      }
  
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
  
      return this.http.put(URL + 'affecter-materiel/' + materiel._id, materiel, { headers });
    }

    getMaterielsAffectedToAgent(): Observable<any[]> {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token introuvable');
      }
  
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
      });
  
      return this.http.get<any[]>(URL + 'get-materiels-affected-to-agent', { headers });
    }
    receiveMateriel(materiel: any): Observable<any> {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token introuvable');
      }
    
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
    
      return this.http.put(URL + 'receive-materiel', materiel, { headers });
    }
    
  }
