import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: any;
  constructor() { 
    this.user= {role:'admin'};
  }

  getUserRole(): string{
    return this.user.role;
  }

  setUserRole(role:string): void{
    this.user.role = role;
  }
}

