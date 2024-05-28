import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClaimService } from '../../../services/claim.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterPipe } from '../../../filter.pipe';


@Component({
  selector: 'app-fournisseur-claims',
  standalone: true,
  imports: [ReactiveFormsModule,RouterModule,RouterOutlet,CommonModule,FormsModule,NgxPaginationModule,FilterPipe],
  templateUrl: './fournisseur-claims.component.html',
  styleUrl: './fournisseur-claims.component.css'
})
export class FournisseurClaimsComponent {
  claims: any[] = [];
  p: number = 1;
  searchText: string = '';

  constructor(private claimService: ClaimService, private toast: ToastrService) { }

  ngOnInit(): void {
    this.getClaimsForFournisseur();
  }

  getClaimsForFournisseur(): void {
    this.claimService.getClaimsForFournisseur().subscribe(
      (data: any[]) => {
        console.log(data, 'data');
        this.claims = data;
      },
      (error) => {
        this.toast.error('Erreur lors de la récupération des réclamations');
        console.error('Erreur lors de la récupération des réclamations:', error);
      }
    );
  }

  ReceiveClaim(claim: any): void {
    this.claimService.receiveClaim(claim).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.toast.success(resp.message);
          this.getClaimsForFournisseur();
        } else {
          this.toast.error(resp.message);
        }
      },
      error:(error) => {
        this.toast.error('Erreur lors de la mise à jour de la réclamation');
        console.error('Erreur lors de la mise à jour de la réclamation:', error);
      }
    });
    
  }
}
