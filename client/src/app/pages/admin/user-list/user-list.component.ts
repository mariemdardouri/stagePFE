import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';
import { RegisterComponent } from '../../register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    RegisterComponent,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent {
  displayedColumns: string[] = [
    'Nom',
    'Prénom',
    'CIN',
    'Email',
    'NumTél',
    'Role',
    'Statut',
    'Actions',
  ];
  selectedUser: any = {};
  userList: any[] = [];
  p: number = 1;

  constructor(private userService: UserService, private toast: ToastrService) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers(): void {
    this.userService.getAllUser().subscribe(
      (data: any[]) => {
        this.userList = data.filter((user: any) => user.role !== 'admin');
      },
      (error) => {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
      }
    );
  }

  editUser(user: any): void {
    this.selectedUser = user;
  }

  updateUser(): void {
    if (this.selectedUser) {
      this.userService.updateUser(this.selectedUser).subscribe({
        next: (resp: any) => {
          if (resp.success) {
            this.toast.success(resp.message);
            this.getAllUsers();
            this.selectedUser = {};
          } else {
            this.toast.error(resp.message);
          }
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour de l\'utilisateur:', err);
          if (err.status === 500) {
            this.toast.error("Erreur lors de la mise à jour de l'utilisateur");
          }
        },
      });
    }
  }

  desactivateUser(userId: string): void {
    this.userService.desactivateUser(userId).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.toast.success(resp.message);
          this.getAllUsers();
        } else {
          this.toast.error(resp.message);
        }
      },
      error: (err) => {
        console.error('Erreur lors du desactivation de l\'utilisateur:', err);
        if (err.status === 500) {
          this.toast.error("Erreur lors du desactivation de l'utilisateur");
        }
      },
    });
  }

  onlyLetters(event: any) {
    const pattern = /[a-zA-Z]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  onlyNumbers(event: any) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

}
