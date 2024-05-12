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
    return this.materielList.every((materiel) => materiel.checked);
  }

  accepter(): void {
    if (this.allChecked()) {
      this.toast.success('Tous les matériels ont été acceptés.');
    } else {
      this.toast.error(
        'Vous devez vérifier tous les matériels avant de les accepter.'
      );
    }
  }

  rejeter(): void {
    this.toast.success('Tous les matériels ont été rejetés.');
  }
}
