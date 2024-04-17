import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule , RouterOutlet, RouterModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
    adminMenu=[
    {label:"Les utilisateurs" , link:"user-list"},
    {label:"Deconnection", link:"login"}
  ];
    userMenu=[ 
    {label:"Deconnection", link:"login"}
  ];
   menuItems: any ;
   isSidebarOpen: boolean= false;
   isClicked: boolean= false;

  firstName: string='';
  user: any;
    

   constructor( private userService:UserService) {}

   
    


  toggleSidebar():void{
    this.isSidebarOpen = !this.isSidebarOpen;
  } 

  toggleShadow(event: MouseEvent):void{
    this.isClicked = !this.isClicked;
  }
  getUser(role:string):void{
     localStorage.getItem('token');
    this.userService.getUser(role).subscribe({next:(resp:any)=>{
      console.log(resp);
      this.firstName = resp.user.firstName;
      this.menuItems = role === resp.user.role ? this.adminMenu : this.userMenu;
    },error: (err)=>{
      console.log(err);
      if(err.status==500){
        alert(err.error.msg)
      }
    }});
  }
}