import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterielService } from '../../services/materiel.service';
import { ClaimService } from '../../services/claim.service';

@Component({
  selector: 'app-agent',
  standalone: true,
  imports: [CommonModule,RouterOutlet,RouterModule,ReactiveFormsModule,FormsModule],
  templateUrl: './agent.component.html',
  styleUrl: './agent.component.css'
})
export class AgentComponent {
  affectedMateriels: any[] = [];
  showClaimModal: boolean = false;
  selectedMateriel: any = {};
  description: any;
 

  constructor(private materielService: MaterielService, private toast: ToastrService,private claimService: ClaimService,) {}

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
    this.materielService.receiveMateriel(materiel).subscribe(
      () => {
        this.toast.success('Materiel received successfully.');
        this.selectedMateriel = materiel;
        // Send notification to logistique user
      },
      (error) => {
        console.error('Error receiving materiel:', error);
        this.toast.error('Error receiving materiel.');
      }
    );
  }

  
  createReclamation(description: any): void {
    console.log(this.selectedMateriel,'selectedMateriel');
    if (this.selectedMateriel) {
      const reclamationData = {
        materielId: this.selectedMateriel._id, // Include materiel ID
        description: description
      };
      this.claimService.createReclamation(reclamationData).subscribe(
        () => {
          this.toast.success('Reclamation created successfully');
        },
        (error) => {
          console.error('Error creating reclamation:', error);
          this.toast.error('Error creating reclamation');
        }
      );
    } else {
      console.error('selectedMateriel is null');
    }
  }
}
