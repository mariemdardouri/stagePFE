import { Component } from '@angular/core';
import { MaterielService } from '../../services/materiel.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterPipe } from '../../filter.pipe';

@Component({
  selector: 'app-logistique',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    RouterOutlet,
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    FilterPipe,
  ],
  templateUrl: './logistique.component.html',
  styleUrl: './logistique.component.css',
})
export class LogistiqueComponent {
  materielList: any[] = [];
  userList: any[] = [];
  selectedMateriel: any;
  isAgentDisabled:boolean =false;
  p: number = 1;
  searchText: string = '';

  constructor(
    private materielService: MaterielService,
    private userService: UserService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAllMateriels();
    this.getAllUsers();
  }

  getAllMateriels(): void {
    this.materielService.getMateriels().subscribe(
      (data: any[]) => {
        console.log(data, 'data');
        this.materielList = data.filter((materiel) => materiel.numInv !== '');
        console.log(data, 'materielList');
        this.materielList.forEach((materiel) => {
          if (materiel.agent) {
            materiel.isAgentDisabled = true;
          } else {
            materiel.isAgentDisabled = false;
          }
        });
      },
      (error) => {
        console.error(
          'Erreur lors de la récupération des utilisateurs:',
          error
        );
      }
    ); 
  }

  getAllUsers(): void {
    this.userService.getAllUser().subscribe(
      (users: any[]) => {
        this.userList = users.filter((user) => user.role === 'agent');
      },
      (error) => {
        console.error(
          'Erreur lors de la récupération des utilisateurs:',
          error
        );
      }
    );
  }
  affecterMateriel(materiel: any): void {
    if (materiel) {
      this.materielService.affectMateriel(materiel).subscribe({
        next: (resp: any) => {
          if (resp.success) {
            this.toast.success(resp.message);
            this.getAllMateriels();
          } else {
            this.toast.error(resp.message);
          }
        },
        error: (error) => {
          console.error("Erreur lors de l'affectation du matériel:", error);
          this.toast.error("Erreur lors de l'affectation du matériel.");
        }
      });
    }
  }

  editNumInv(materiel: any): void {
    materiel.isAgentDisabled = false;
  } 
}
