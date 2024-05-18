import { Component } from '@angular/core';
import { ClaimService } from '../../services/claim.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterielService } from '../../services/materiel.service';

@Component({
  selector: 'app-claim',
  standalone: true,
  imports: [    ReactiveFormsModule,RouterModule,RouterOutlet,CommonModule,FormsModule,],
  templateUrl: './claim.component.html',
  styleUrl: './claim.component.css'
})
export class ClaimComponent {
claims: any[] = [];
materiels: any[] = [];
  constructor(private claimService: ClaimService,private toast: ToastrService, private materielService: MaterielService,) { }

  ngOnInit(): void {
    this.getAllClaims();
    this.getAllMateriels();
  }
  
  getAllClaims(): void {
    this.claimService.getAllClaims().subscribe(
      (data: any[]) => {
        this.claims = data;
      },
      (error) => {
        console.error('Error fetching claims:', error);
        this.toast.error("Error fetching claims.");
      }
    );
  }

  getAllMateriels(): void {
    this.materielService.getMaterielsAffectedToAgent().subscribe(
      (data: any[]) => {
        this.materiels = data;
      },
      (error) => {
        console.error('Error fetching materiels:', error);
        this.toast.error("Error fetching materiels.");
      }
    );
  }
  modifyClaim(claim: any): void {
    // Implement logic to modify the claim
  }

  acceptClaim(claim: any): void {
    // Implement logic to accept the claim
  }

  getMaterielCategory(numInv: string): string {
    const materiel = this.materiels.find(m => m.numInv === numInv);
    return materiel ? materiel.categorie : 'N/A';
  }
}
