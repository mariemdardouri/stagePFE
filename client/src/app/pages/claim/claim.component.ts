import { Component } from '@angular/core';
import { ClaimService } from '../../services/claim.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterielService } from '../../services/materiel.service';
import { AuthService } from '../../services/auth.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterPipe } from '../../filter.pipe';

@Component({
  selector: 'app-claim',
  standalone: true,
  imports: [ReactiveFormsModule,RouterModule,RouterOutlet,CommonModule,FormsModule,NgxPaginationModule,FilterPipe,],
  templateUrl: './claim.component.html',
  styleUrl: './claim.component.css'
})
export class ClaimComponent {
  selectedClaim: any = {};
  claims: any[] = [];
  userId: any;
  p: number = 1;
  searchText: string = '';

  constructor(private claimService: ClaimService,  private route: ActivatedRoute,private toast: ToastrService, private materielService: MaterielService,) { }

  ngOnInit(): void {
    this.getClaimsByMateriel();
  }

  getClaimsByMateriel(): void {
    this.claimService.getClaimsByMateriel(this.userId).subscribe(
      (data) => {
        this.claims = data;
        console.log(data,'claims');
      },
      (error) => {
        console.error('Erreur lors de la récupération des réclamations par matériel:', error);
        this.toast.error("Erreur lors de la récupération des réclamations par matériel");
      }
    );
  }
  
  editClaim(claim: any): void {
    this.selectedClaim = claim;
  }
  
  updateClaim(): void {
    if (this.selectedClaim) {
      this.claimService.updateClaim(this.selectedClaim).subscribe({
        next: (resp: any) => {
          if (resp.success) {
            this.toast.success(resp.message);
            this.getClaimsByMateriel();
            this.selectedClaim = {};
          } else {
            this.toast.error(resp.message);
          }
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour de la réclamation:', err);
          if (err.status === 500) {
            this.toast.error('Erreur lors de la mise à jour de la réclamation');
          }
        },
      });
    }
  }

  acceptClaim(claim: any): void {
    this.claimService.acceptClaim(claim).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.toast.success(resp.message);
          this.getClaimsByMateriel();
        } else {
          this.toast.error(resp.message);
        }
      },
      error:(error) => {
        console.error('Error receiving reclamation:', error);
        this.toast.error('Error receiving reclamation.');
      }
  });
  }
  openDeleteModal(claim: any): void {
    this.selectedClaim = claim;
  }

  deleteClaim(): void {
    if(this.selectedClaim){
      this.claimService.deleteClaim(this.selectedClaim).subscribe({
        next: (resp: any) => {
          if (resp.success) {
            this.toast.success(resp.message);
            this.getClaimsByMateriel();
          } else {
            this.toast.error(resp.message);
          }
        },
        error: (err) => {
          console.error('Erreur lors de la suppression de la réclamation:', err);
          if (err.status === 500) {
            this.toast.error('Erreur lors de la suppression de la réclamation');
          }
        },
      });
    }
  }    
}
