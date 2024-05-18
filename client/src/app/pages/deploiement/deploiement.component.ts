import { Component } from '@angular/core';
import { MaterielService } from '../../services/materiel.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-deploiement',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    RouterOutlet,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './deploiement.component.html',
  styleUrl: './deploiement.component.css',
})
export class DeploiementComponent {
  materielList: any[] = [];
  checkedMateriels: any[] = [];
  constructor(
    private materielService: MaterielService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAllMateriels();
  }

  getAllMateriels(): void {
    this.materielService.getMateriels().subscribe(
      (data: any[]) => {
        console.log(data, 'data');
        this.materielList = data;
        console.log(data, 'materielList');
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  allChecked(): boolean {
    return this.materielList.every((materiel) => materiel.checked || materiel.status === 'accepted');
  }

  accepter(): void {
    if (this.allChecked()) {
      const uncheckedAcceptedMateriels = this.materielList.filter(materiel => !materiel.checked && materiel.status === 'accepted');
      if (uncheckedAcceptedMateriels.length === 0) {
        this.toast.error('Vous ne pouvez pas vérifier à nouveau les matériels déjà acceptés.');
        return;
      }
  
      this.materielService.updateCheckedMateriels(this.materielList).subscribe(
        (response) => {
          this.toast.success('Tous les matériels ont été acceptés.');
        },
        (error) => {
          console.error('Error updating materiels:', error);
          this.toast.error('Une erreur est survenue lors de la mise à jour des matériels.');
        }
      );
    } else {
      this.toast.error('Vous devez vérifier tous les matériels avant de les accepter.');
    }
  }

  rejeter(): void {
    const uncheckedMateriels = this.materielList.filter(materiel => !materiel.checked);
    if (uncheckedMateriels.length > 0) {
      this.materielService.rejectMateriels(uncheckedMateriels).subscribe(
        (response) => {
          this.toast.success('Les matériels non vérifiés ont été rejetés.');
          // Remove the rejected materiels from the list
          this.materielList = this.materielList.filter(materiel => materiel.checked);
        },
        (error) => {
          console.error('Error rejecting materiels:', error);
          this.toast.error('Erreur lors de la réjection des matériels.');
        }
      );
    } else {
      this.toast.error('Aucun matériel non vérifié trouvé.');
    }
  }
}
