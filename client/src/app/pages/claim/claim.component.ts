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
  imports: [ReactiveFormsModule,RouterModule,RouterOutlet,CommonModule,FormsModule,],
  templateUrl: './claim.component.html',
  styleUrl: './claim.component.css'
})
export class ClaimComponent {
  claims: any[] = [];

  constructor(private claimService: ClaimService,private toast: ToastrService, private materielService: MaterielService,) { }

  ngOnInit(): void {
    this.getClaimsByMateriel();
  }

  getClaimsByMateriel(): void {
    this.claimService.getClaimsByMateriel().subscribe(
      (data: any[]) => {
        this.claims = data;
        console.log(data,'claims');
      },
      (error) => {
        console.error('Error fetching claims by materiel:', error);
        this.toast.error("Error fetching claims by materiel.");
      }
    );
  }

  modifyClaim(claim: any): void {
    // Implement logic to modify the claim
  }

  acceptClaim(claim: any): void {
    // Implement logic to accept the claim
  }

}
