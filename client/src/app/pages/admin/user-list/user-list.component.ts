import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';
import { RegisterComponent } from '../../register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule , RouterOutlet, RouterModule,RegisterComponent,FormsModule , ReactiveFormsModule,  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {
  
  displayedColumns: string[] = ['Nom', 'Prénom', 'CIN', 'Email', 'NumTél', 'Role', 'Action'];
  selectedUser:any = {};
  userList:any[]=[];
  constructor ( private userService : UserService, private  toast:ToastrService){}
  
  ngOnInit():void {
    this.getAllUsers(); 
  }


  getAllUsers():void{
    this.userService.getAllUser().subscribe(
      (data: any[]) => {
        this.userList = data.filter((user: any) => user.role !== 'admin');
      },
      (error) => {
        console.error('Error fetching users:', error);
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
          console.error('Error updating user:', err);
          if (err.status === 500) {
            this.toast.error('Erreur lors de la mise à jour de l\'utilisateur');
          }
        }
      });
    }
  }
}