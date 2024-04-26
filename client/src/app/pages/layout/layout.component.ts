import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent implements OnInit {
  adminMenu = [
    { label: 'Les utilisateurs', path: '/admin', icon: 'bi bi-person ' },
    { label: 'Déconnexion', path: '/login', icon: 'bi bi-box-arrow-left ' },
  ];
  FournisseurMenu = [
    { label: 'Liste de matériel', path: '/fournisseur', icon: 'bi bi-person ' },
    { label: 'Déconnexion', path: '/login', icon: 'bi bi-box-arrow-left' },
  ];
  DeploiementMenu = [
    { label: 'Liste de matériel', path: '/deploiement', icon: 'bi bi-person ' },
    { label: 'Déconnexion', path: '/login', icon: 'bi bi-box-arrow-left' },
  ];
  ApproMenu = [
    { label: 'Liste de matériel', path: '/appro', icon: 'bi bi-person ' },
    { label: 'Déconnexion', path: '/login', icon: 'bi bi-box-arrow-left' },
  ];
  userMenu = [
    { label: 'Déconnexion', path: '/login', icon: 'bi bi-box-arrow-left' },
  ];
  menuItems: any;
  isSidebarOpen: boolean = false;
  isClicked: boolean = false;

  itemActive: any;
  firstName: any;
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      const role = localStorage.getItem('role');
      this.authService.getUserInfo().subscribe({
        next: (userInfo: any) => {
          console.log(userInfo);
          console.log(userInfo.token.firstName);
          this.firstName = userInfo.token.firstName;
        },
      });
      console.log(role);
      if (role === 'admin') {
        this.menuItems = this.adminMenu;
      } else if (role === 'fournisseur') {
        this.menuItems = this.FournisseurMenu;
      } else if (role === 'deploiement') {
        this.menuItems = this.DeploiementMenu;
      } else if (role === 'approvisionnement') {
        this.menuItems = this.ApproMenu;
      }
    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleShadow(event: MouseEvent): void {
    this.isClicked = !this.isClicked;
  }
}
