import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { RegisterComponent } from '../../register/register.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule , RouterOutlet, RouterModule,RegisterComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {
  displayedColumns: string[] = ['Nom', 'Prénom', 'CIN', 'Email', 'NumTél', 'Role', 'Action'];
  user:any ;
  userList:any[]=[];
  constructor (private userService : UserService){}
  
  ngOnInit():void {
    this.getAllUsers();
}
  getAllUsers(){
    this.userService.getAllUser().subscribe((data:any[])=>{
      console.log(data);
      this.userList=data.filter(user => user.role !== 'admin');
    },
    (err)=>{
      console.error('erreur lors de la récupération des utilisateurs :', err);
    }
  );
  }
}
