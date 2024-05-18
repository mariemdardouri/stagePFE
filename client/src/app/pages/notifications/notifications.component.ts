import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../../services/notification.service';
import { LayoutComponent } from '../layout/layout.component';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, RouterOutlet, CommonModule],
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
          console.error('Invalid response format or unseenNotifications is not an array');
        }

        if (response && response.seenNotifications && Array.isArray(response.seenNotifications)) {
          this.seenNotifications = response.seenNotifications;
        } else {
          console.error('Invalid response format or seenNotifications is not an array');
        }
      },
      (error) => {
        console.error('Error fetching user notifications:', error);
        this.toast.error('Error fetch ing user notifications');
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
        this.toast.success('all notification mark as seen');

        this.notificationService.setUnseenNotificationsCount(0);
      },
      (error) => {
        console.error('Error marking all notifications as seen:', error);
        this.toast.error('Error marking all notifications as seen');
      }
    );
  }
  
  deleteAllNotifications(): void {
    // Logic to delete all notifications
    this.notificationService.deleteAllNotifications(this.user).subscribe(
      (response: any) => {
        this.seenNotifications = [];
        // Clear the seenNotifications array or handle success
        this.toast.success('all notification has deleted');
      },
      (error) => {
        console.error('Error deleting all notifications:', error);
        this.toast.error('Error deleting all notifications');
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
