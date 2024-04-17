import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule , RouterOutlet, RouterModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit{
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
   role: string ='admin';
   user: any;

   constructor() {}

   ngOnInit(): void {
     this.menuItems = this.role === 'admin' ? this.adminMenu : this.userMenu;
   }


  toggleSidebar():void{
    this.isSidebarOpen = !this.isSidebarOpen;
  } 

  toggleShadow(event: MouseEvent):void{
    this.isClicked = !this.isClicked;
  }

  
}