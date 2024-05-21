import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClaimService } from '../../../services/claim.service';

@Component({
  selector: 'app-logistique-claims',
  standalone: true,
  imports: [ReactiveFormsModule,RouterModule,RouterOutlet,CommonModule,FormsModule],
  templateUrl: './logistique-claims.component.html',
  styleUrl: './logistique-claims.component.css'
})
export class LogistiqueClaimsComponent {

  claims: any[] = [];

  constructor(private claimService: ClaimService,private toast: ToastrService) { }

  ngOnInit(): void {
    this.getAllClaims();
  }


  getAllClaims(): void {
    this.claimService.getAllClaims().subscribe(
      (data: any[]) => {
        console.log(data, 'data');
        this.claims = data;
        console.log(data, 'claims');
      },
      (error) => {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
      }
    );
  }

}
