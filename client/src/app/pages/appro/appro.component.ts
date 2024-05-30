import { Component } from '@angular/core';
import { MaterielService } from '../../services/materiel.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-appro',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    RouterOutlet,
    CommonModule,
    FormsModule,
    NgxPaginationModule,
  ],
  templateUrl: './appro.component.html',
  styleUrl: './appro.component.css',
})
export class ApproComponent {
  materielList: any[] = [];
  isNumInvDisabled: boolean = false;
  isClicked: boolean = false;
  materiel: any;
  p: number = 1;
  selectedMateriel: any;

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
        this.materielList = data.filter(materiel => materiel.status !== 'rejected' && materiel.status !== 'pending');
        console.log(data, 'materielList');
        this.materielList.forEach((materiel) => {
          if (materiel.numInv) {
            materiel.isNumInvDisabled = true;
          } else {
            materiel.isNumInvDisabled = false;
          }
        });
      },
      (error) => {
        console.error('Erreur lors de la récupération des matériels:', error);
      }
    );
  }

  hasAllNumInvFilled(): boolean {
    return this.materielList.every((materiel) => materiel.numInv && materiel.numInv.trim() !== '');
  }

  editNumInv(materiel: any): void {
    materiel.isNumInvDisabled = false;
  }

  updateMateriel(materiel: any): void {
    this.materielService.updateMateriel(materiel).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.toast.success(resp.message);
          this.getAllMateriels();
        } else {
          this.toast.error(resp.message);
        }
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du matériel:', err);
        if (err.status === 500) {
          this.toast.error(
            `Erreur lors de l'enregistrement du numéro d'inventaire`
          );
        }
      },
    });
  }
  openDeleteModal(materiel: any): void {
    this.selectedMateriel = materiel;
  }
  deleteNumInv(): void {
    this.selectedMateriel.numInv = '';
    this.selectedMateriel.isNumInvDisabled = false;
    this.materielService.updateMateriel(this.selectedMateriel).subscribe(
      () => {
        this.toast.success("Numéro d'inventaire supprimé avec succès.");
      },
      (error) => {
        this.toast.error(
          "Erreur lors de la suppression du numéro d'inventaire."
        );
        console.error('Erreur lors de la suppression du numéro d\'inventaire:', error);
      }
    );
  }
}
