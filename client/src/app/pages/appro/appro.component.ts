import { Component } from '@angular/core';
import { MaterielService } from '../../services/materiel.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-appro',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    RouterOutlet,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './appro.component.html',
  styleUrl: './appro.component.css',
})
export class ApproComponent {
  materielList: any[] = [];
  isNumInvDisabled: boolean = false;
  isClicked: boolean = false;
  materiel: any;

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
        this.materielList.forEach((materiel) => {
          if (materiel.numInv) {
            materiel.isNumInvDisabled = true;
          } else {
            materiel.isNumInvDisabled = false;
          }
        });
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  hasAllNumInvFilled(): boolean {
    return this.materielList.every((materiel) => materiel.numInv);
  }

  editNumInv(materiel: any): void {
    materiel.isNumInvDisabled = false;
  }

  updateMateriel(materiel: any): void {
    this.materielService.updateMateriel(materiel).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.toast.success("Numéro d'inventaire mis à jour avec succès.");
          this.getAllMateriels();
        } else {
          this.toast.error(resp.message);
        }
      },
      error: (err) => {
        console.error('Error updating materiel:', err);
        if (err.status === 500) {
          this.toast.error(
            `Erreur lors de l'enregistrement du numéro d'inventaire`
          );
        }
      },
    });
  }

  deleteNumInv(materiel: any): void {
    materiel.numInv = '';
    materiel.isNumInvDisabled = false;
    this.materielService.updateMateriel(materiel).subscribe(
      () => {
        this.toast.success("Numéro d'inventaire supprimé avec succès.");
      },
      (error) => {
        this.toast.error(
          "Erreur lors de la suppression du numéro d'inventaire."
        );
        console.error('Error deleting materiel:', error);
      }
    );
  }
}
