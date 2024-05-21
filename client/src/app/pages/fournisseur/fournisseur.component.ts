import { Component } from '@angular/core';
import { MaterielService } from '../../services/materiel.service';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-fournisseur',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    RouterOutlet,
    CommonModule,
  ],
  templateUrl: './fournisseur.component.html',
  styleUrl: './fournisseur.component.css',
})
export class FournisseurComponent {
  materielList: any[] = [];
  materielForm!: FormGroup;
  selectedMateriel: any = {};
  constructor(
    private materielService: MaterielService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.setForm();
    this.getAllMateriels();
  }

  setForm(): void {
    this.materielForm = new FormGroup({
      categorie: new FormControl('', [Validators.required]),
      nature: new FormControl('', [Validators.required]),
      numSerie: new FormControl('', [Validators.required]),
    });
  }

  submit(): void {
    console.log(this.materielForm.value);
    this.materielService.addMateriel(this.materielForm.value).subscribe({
      next: (resp: any) => {
        console.log(resp);
        if (resp.success) {
          this.toast.success(resp.message);
          this.getAllMateriels();
        } else {
          this.toast.error(resp.message);
        }
      },
      error: (err) => {
        console.log(err);
        if (err.status === 500) {
          this.toast.error("Erreur lors de l'ajout du matériel");
        }
      },
    });
  }
  getAllMateriels(): void {
    this.materielService.getMateriels().subscribe(
      (data: any[]) => {
        console.log(data, 'data');
        this.materielList = data;
        console.log(data, 'materielList');
      },
      (error) => {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
      }
    );
  }

  editMateriel(materiel: any): void {
    this.selectedMateriel = materiel;
  }

  updateMateriel(): void {
    if (this.selectedMateriel) {
      this.materielService.updateMateriel(this.selectedMateriel).subscribe({
        next: (resp: any) => {
          if (resp.success) {
            this.toast.success(resp.message);
            this.getAllMateriels();
            this.selectedMateriel = {};
          } else {
            this.toast.error(resp.message);
          }
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour du materiel:', err);
          if (err.status === 500) {
            this.toast.error('Erreur lors de la mise à jour du materiel');
          }
        },
      });
    }
  }

  deleteMateriel(materiel: any): void {
    this.materielService.deleteMateriel(materiel).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.toast.success(resp.message);
          this.getAllMateriels();
        } else {
          this.toast.error(resp.message);
        }
      },
      error: (err) => {
        console.error('Erreur lors de la suppression du materiel:', err);
        if (err.status === 500) {
          this.toast.error('Erreur lors de la suppression du materiel');
        }
      },
    });
  }
}
