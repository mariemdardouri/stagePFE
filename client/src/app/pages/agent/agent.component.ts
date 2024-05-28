import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterielService } from '../../services/materiel.service';
import { ClaimService } from '../../services/claim.service';
import { response } from 'express';
import { AuthService } from '../../services/auth.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterPipe } from '../../filter.pipe';

@Component({
  selector: 'app-agent',
  standalone: true,
  imports: [CommonModule,RouterOutlet,RouterModule,ReactiveFormsModule,FormsModule,NgxPaginationModule,FilterPipe],
  templateUrl: './agent.component.html',
  styleUrl: './agent.component.css'
})
export class AgentComponent {
  affectedMateriels: any[] = [];
  showClaimModal: boolean = false;
  selectedMateriel: any = null;
  description: any;
  p: number = 1;
  searchText: string = '';
 

  constructor(
    private materielService: MaterielService, 
    private toast: ToastrService,
    private claimService: ClaimService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.getMaterielsAffectedToAgent();
  }

  getMaterielsAffectedToAgent(): void {
    // Assuming you have a method in MaterielService to fetch affected materiels for the agent
    this.materielService.getMaterielsAffectedToAgent().subscribe(
      (data: any[]) => {
        this.affectedMateriels = data;
        console.log(data,'data');
      },
      (error) => {
        console.error('Error fetching affected materiels:', error);
        this.toast.error("Error fetching affected materiels.");
      }
    );
  }

  receiveMateriel(materiel: any): void {
    materiel.received = true;
    this.materielService.receiveMateriel(materiel).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.toast.success(resp.message);
          this.getMaterielsAffectedToAgent();
        } else {
          this.toast.error(resp.message);
        }
      },
      error:(error) => {
        console.error('Error receiving materiel:', error);
        this.toast.error('Error receiving materiel.');
      }
  });
  }

  selectMateriel(materiel: any): void {
    this.selectedMateriel = materiel;
    console.log(this.selectedMateriel,'selected');
    this.description = ''; // Reset the description when selecting a new materiel
  }
  createReclamation(description:any): void {
    if (this.selectedMateriel && this.selectedMateriel._id) {
      const userId = this.authService.getUserId();
      const materielId = this.selectedMateriel._id;
      const reclamationData = {
        userId: userId,
        description: description, // Corrected parameter name
        materielId: materielId,
      };
  
      this.claimService.createReclamation(reclamationData).subscribe({
        next: (resp: any) => {
          if (resp.success) {
            this.toast.success(resp.message);
          } else {
            this.toast.error(resp.message);
          }
        },
        error: (error) => {
          console.error('Erreur lors de la création de la réclamation :', error);
          this.toast.error('Erreur lors de la création de la réclamation');
        }
      });
    } else {
      console.error('Le matériel sélectionné est nul');
    }
  }
}
