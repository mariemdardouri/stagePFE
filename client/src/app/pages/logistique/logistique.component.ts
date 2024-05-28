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
  p: number = 1;
  searchText: string = '';

  constructor(
    private materielService: MaterielService,
    private userService: UserService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAllMateriels();
  }

  getAllMateriels(): void {
    this.materielService.getMateriels().subscribe(
      (data: any[]) => {
        console.log(data, 'data');
        this.materielList = data.filter((materiel) => materiel.numInv);
        console.log(data, 'materielList');
      },
      (error) => {
        console.error(
          'Erreur lors de la récupération des utilisateurs:',
          error
        );
      }
    );

    this.userService.getAllUser().subscribe(
      (users: any[]) => {
        this.userList = users;
      },
      (error) => {
        console.error(
          'Erreur lors de la récupération des utilisateurs:',
          error
        );
      }
    );
  }

  affecterMateriels(): void {
    const materielsToUpdate = this.materielList.filter(
      (materiel) => materiel.agent
    );
    console.log(materielsToUpdate, 'materielsToUpdate');
    this.materielService
      .affectMateriels({ materiels: materielsToUpdate })
      .subscribe(
        (response: any) => {
          this.toast.success(response.message);
        },
        (error) => {
          console.error("Erreur lors de l'affectation des matériels:", error);
          this.toast.error("Erreur lors de l'affectation des matériels.");
        }
      );
  }
}
