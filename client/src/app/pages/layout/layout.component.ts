import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule , RouterOutlet, RouterModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit{
    adminMenu=[
    {label:"Les utilisateurs" , path:"/admin",icon:"bi bi-person "},
    {label:"Déconnexion", path:"/login" ,icon:"bi bi-box-arrow-left "}
  ];
  FournisseurMenu=[
    {label:"Liste de matériel" , path:"/Fournisseur",icon:"bi bi-person "},
   { label:"Déconnexion", path:"/login",icon:"bi bi-box-arrow-left"},

  ];
    userMenu=[ 
    {label:"Déconnexion", path:"/login",icon:"bi bi-box-arrow-left"}
  ];
   menuItems: any ;
   isSidebarOpen: boolean= false;
   isClicked: boolean= false;

itemActive: any;
   //firstName: string = '';
   

   constructor(private router: Router,private authService:AuthService) {}

   ngOnInit(): void {
    if(typeof localStorage !== 'undefined'){
    const role = localStorage.getItem('role');
    console.log(role);
    if(role === 'admin'){
    this.menuItems = this.adminMenu;
    }else if(role ==='fournisseur'){
      this.menuItems = this.FournisseurMenu;
    }
  }
   }


  toggleSidebar():void{
    this.isSidebarOpen = !this.isSidebarOpen;
  } 

  toggleShadow(event: MouseEvent):void{
    this.isClicked = !this.isClicked;
  }
  
}