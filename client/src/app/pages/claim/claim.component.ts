import { Component } from '@angular/core';
import { ClaimService } from '../../services/claim.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterielService } from '../../services/materiel.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-claim',
  standalone: true,
  imports: [ReactiveFormsModule,RouterModule,RouterOutlet,CommonModule,FormsModule,],
  templateUrl: './claim.component.html',
  styleUrl: './claim.component.css'
})
export class ClaimComponent {
  claims: any[] = [];
  userId: any;
  

  constructor(private claimService: ClaimService,  private route: ActivatedRoute,private toast: ToastrService, private materielService: MaterielService,) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.params['userId'];
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

}
