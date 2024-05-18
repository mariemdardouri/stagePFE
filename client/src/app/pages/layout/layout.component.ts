  import { CommonModule } from '@angular/common';
  import { Component, EventEmitter, OnInit, Output } from '@angular/core';
  import { Router, RouterModule, RouterOutlet } from '@angular/router';
  import { AuthService } from '../../services/auth.service';
  import { NotificationService } from '../../services/notification.service';
import { NotificationsComponent } from '../notifications/notifications.component';

  @Component({
    selector: 'app-layout',
    standalone: true,
    imports: [CommonModule, RouterOutlet, RouterModule,NotificationsComponent],
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.css',
    providers: [NotificationsComponent]
  })
  export class LayoutComponent implements OnInit {
    adminMenu = [
      { label: 'Les utilisateurs', path: '/admin', icon: 'bi bi-person ' },
      { label: 'Les demandes', path: '/admin/request', icon: 'bi bi-person ' },
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
      {
        label: 'Liste de matériel',
        path: '/approvisionnement',
        icon: 'bi bi-person ',
      },
      { label: 'Déconnexion', path: '/login', icon: 'bi bi-box-arrow-left' },
    ];
    LogistiqueMenu = [
      { label: 'Liste de matériel', path: '/logistique', icon: 'bi bi-person ' },
      {
        label: 'Liste de mission',
        path: '/logistique/mission',
        icon: 'bi bi-person ',
      },
      { label: 'Déconnexion', path: '/login', icon: 'bi bi-box-arrow-left' },
    ];
    ResponsableSiteMenu = [
      { label: 'Déconnexion', path: '/login', icon: 'bi bi-box-arrow-left' },
    ];
    AgentLogistiqueMenu = [
      { label: 'liste des mission', path: '/agentLogistique', icon: 'bi bi-box-arrow-left' },
      { label: 'Déconnexion', path: '/login', icon: 'bi bi-box-arrow-left' },
    ];
    AgentMenu = [
      { label: 'Liste de matériel', path: '/agent', icon: 'bi bi-person ' },
      { label: 'Liste de réclamation', path: '/agent/claim', icon: 'bi bi-person ' },
      { label: 'Déconnexion', path: '/login', icon: 'bi bi-box-arrow-left' },
    ];
    menuItems: any;
    isSidebarOpen: boolean = false;
    isClicked: boolean = false;
    unseenNotificationsCount: number = 0;
    unseenNotifications: any;
    itemActive: any;
    firstName: any;
    constructor(private router: Router, private authService: AuthService,private notificationService: NotificationService, private notificationsComponent: NotificationsComponent) {}

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
        } else if (role === 'logistique') {
          this.menuItems = this.LogistiqueMenu;
        } else if (role === 'agentLogistique') {
          this.menuItems = this.AgentLogistiqueMenu;
        } else if (role === 'responsableSite') {
          this.menuItems = this.ResponsableSiteMenu;
        } else if (role === 'agent') {
          this.menuItems = this.AgentMenu;
        }
        this.getUserNotificationsCount();
      }
    }

    getUserNotificationsCount(): void {
      this.notificationService.getUserNotificationsCount().subscribe(
        (count: number) => {
          console.log(count,'count');
          this.unseenNotificationsCount = count;
        },
        (error) => {
          console.error('Error fetching user notifications count:', error);
        }
      );
    }

    onNotificationsUpdated(count: number): void {
    this.unseenNotificationsCount = count;
     }
    toggleSidebar(): void {
      this.isSidebarOpen = !this.isSidebarOpen;
    }

    toggleShadow(event: MouseEvent): void {
      this.isClicked = !this.isClicked;
    }

    goToNotifications(): void {
      this.router.navigate(['/notifications']);
    }
    
  }
