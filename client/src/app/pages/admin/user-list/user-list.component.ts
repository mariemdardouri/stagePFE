import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';
import { RegisterComponent } from '../../register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule , RouterOutlet, RouterModule,RegisterComponent,FormsModule , ReactiveFormsModule, ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {
  
  displayedColumns: string[] = ['Nom', 'Prénom', 'CIN', 'Email', 'NumTél', 'Role', 'Action'];
  selectedUser:any = {};
  userList:any[]=[];
  constructor ( private userService : UserService){}
  
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
      this.userService.updateUser(this.selectedUser).subscribe(
        () => {
          this.getAllUsers();
          // Reset selectedUser to null
          this.selectedUser = {};
        },
        (error) => {
          console.error('Error updating user:', error);
        }
      );
    }
  }
}