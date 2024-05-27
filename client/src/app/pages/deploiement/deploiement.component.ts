import { Component } from '@angular/core';
import { MaterielService } from '../../services/materiel.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-deploiement',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    RouterOutlet,
    CommonModule,
    FormsModule,
    NgxPaginationModule,
  ],
  templateUrl: './deploiement.component.html',
  styleUrl: './deploiement.component.css',
})
export class DeploiementComponent {
  materielList: any[] = [];
  checkedMateriels: any[] = [];
  p: number = 1;

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
        this.materielList = data.filter(materiel => materiel.status === 'pending');
        console.log(data, 'materielList');
      },
      (error) => {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
      }
    );
  }

  allChecked(): boolean {
    return this.materielList.every((materiel) => materiel.checked || materiel.status === 'accept');
  }

  accepter(): void {
    if (this.allChecked()) {
      const uncheckedAcceptedMateriels = this.materielList.filter(materiel => materiel.checked && materiel.status === 'pending');
      if (uncheckedAcceptedMateriels.length === 0) {
        this.toast.error('Vous ne pouvez pas vérifier à nouveau les matériels déjà acceptés.');
        return;
      }
  
      this.materielService.updateCheckedMateriels(this.materielList).subscribe(
        (response: any) => {
          this.toast.success(response.message);
          this.getAllMateriels();
        },
        (error) => {
          console.error('Erreur lors de la mise à jour des matériels:', error);
          this.toast.error(' Erreur lors de la mise à jour des matériels.');
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
          console.error('Erreur lors de la réjection des matériels:', error);
          this.toast.error('Erreur lors de la réjection des matériels.');
        }
      );
    } else {
      this.toast.error('Aucun matériel non vérifié trouvé.');
    }
  }
}
