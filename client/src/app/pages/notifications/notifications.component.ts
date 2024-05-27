import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../../services/notification.service';
import { LayoutComponent } from '../layout/layout.component';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, RouterOutlet, CommonModule,NgxPaginationModule,],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
})
export class NotificationsComponent implements OnInit {
  unseenNotificationsCount: number = 0;
  user: any;
  unseenNotifications: any[] = [];;
  seenNotifications: any;
  notification: any;
  notificationList: any;
  activeTab: 'unseen' | 'seen' = 'unseen';
  p: number = 1;

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.getUserNotifications();
  }

  getUserNotifications(): void {
    this.notificationService.getUserNotifications().subscribe(
      (response: any) => {
        if (response && response.unseenNotifications && Array.isArray(response.unseenNotifications)) {
          this.unseenNotifications = response.unseenNotifications;
          this.updateUnseenNotificationsCount();
        } else {
          console.error('Format de réponse invalide ou unseenNotifications n\'est pas un tableau');
        }

        if (response && response.seenNotifications && Array.isArray(response.seenNotifications)) {
          this.seenNotifications = response.seenNotifications;
        } else {
          console.error('Format de réponse invalide ou sawNotifications n\'est pas un tableau');
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération des notifications utilisateur:', error);
        this.toast.error('Erreur lors de la récupération des notifications utilisateur');
      }
    );
  }
  updateUnseenNotificationsCount(): void {
    this.unseenNotificationsCount = this.unseenNotifications.length;
  }
  markAllAsSeen(): void {
    // Logic to mark all notifications as seen
    this.notificationService.markAllAsSeen(this.user).subscribe(
      (response: any) => {
        this.activeTab = 'seen';
        // Update the seenNotifications array or handle success
        this.seenNotifications = this.unseenNotifications;
        this.unseenNotifications = [];
        this.toast.success(response.message);

        this.notificationService.setUnseenNotificationsCount(0);
      },
      (error) => {
        console.error('Erreur marquant toutes les notifications comme vues:', error);
        this.toast.error('Erreur marquant toutes les notifications comme vues');
      }
    );
  }
  
  deleteAllNotifications(): void {
    // Logic to delete all notifications
    this.notificationService.deleteAllNotifications(this.user).subscribe(
      (response: any) => {
        this.seenNotifications = [];
        // Clear the seenNotifications array or handle success
        this.toast.success(response.message);
      },
      (error) => {
        console.error('Erreur lors de la suppression de toutes les notifications:', error);
        this.toast.error('Erreur lors de la suppression de toutes les notifications');
      }
    );
  }

  setActiveTab(tab: 'unseen' | 'seen'): void {
    this.activeTab = tab;
  }

  navigateToRequests(path: string): void {
    this.router.navigate([path]);
  }
}
