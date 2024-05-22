import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

const URL ="http://localhost:3000/api/claim/";

@Injectable({
  providedIn: 'root'
})
export class ClaimService {

  constructor(private http: HttpClient,private authService: AuthService) { }

  createReclamation(reclamationData: any): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token introuvable');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post<any>(URL + 'add-reclamation', reclamationData , {headers});
  }


  getAllClaims(): Observable<any[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token introuvable');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get<any[]>(URL + 'get-all-claims',{headers});
  }

  getClaimsByMateriel(userId:any): Observable<any[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token introuvable');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any[]>( URL + 'get-claims-by-materiel/'+ userId, { headers });
  }

  sendClaimToFournisseur(claim: any): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token introuvable');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.post( URL + 'send-to-fournisseur', claim, { headers });
  }
  getClaimsForFournisseur(): Observable<any[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token introuvable');
    }
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any[]>(URL + 'get-claims-for-fournisseur', { headers });
  }

  receiveClaim(claim: any): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token introuvable');
    }
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  
    return this.http.put(URL + 'receive-claim', claim, { headers });
  }

  updateClaim(claim: any): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token introuvable');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.put(URL + 'update-claim/' + claim._id, claim, { headers });
  }

  deleteClaim(claim: any): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token introuvable');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.delete(URL + 'delete-claim/' + claim._id, { headers });
  }

  acceptClaim(claim:any): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token introuvable');
    }
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  
    return this.http.put(URL + 'accept-claim', claim, { headers });
  }

  rejectClaim(claim: any[]): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token introuvable');
    }
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  
    return this.http.put(URL + 'reject-materiels', claim, { headers });
  }
}

