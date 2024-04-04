import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule ,LayoutComponent, RouterOutlet, RouterModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
   adminMenu=[
    {name:"Les utilisateurs" , path:"/admin/userList", icon:"bi bi-person"},
    {name:"Deconnection", path:"/logout", icon:"bi bi-box-arrow-right"}
  ];
   userMenu=[ 
    {name:"Deconnection", path:"/logout", icon:"bi bi-box-arrow-right"}
  ];
   menuItems: {name:string, path:string, icon:string}[]=[];
   isSidebarOpen: boolean= false;
   isClicked: boolean= false;

   constructor() {}

  toggleSidebar():void{
    this.isSidebarOpen = !this.isSidebarOpen;
  } 

  toggleShadow(event: MouseEvent):void{
    this.isClicked = !this.isClicked;
  }
  getMenu(role:string):void{
    switch(role){
      case "admin":
        this.menuItems =  this.adminMenu;
        break;
      case "user":
        this.menuItems =  this.userMenu;
        break;
      default :
        console.log("Error: unknown role "+role);
        break;
    }
  }
}
