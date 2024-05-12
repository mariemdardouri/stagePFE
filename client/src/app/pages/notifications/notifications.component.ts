import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, RouterOutlet, CommonModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
})
export class NotificationsComponent {
  user: any;
  unseenNotifications: any[] = [];;
  seenNotifications: any;
  notification: any;
  notificationList: any;
  

  constructor(
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
        } else {
          console.error('Invalid response format or unseenNotifications is not an array');
        }
      },
      (error) => {
        console.error('Error fetching user notifications:', error);
        this.toast.error('Error fetch ing user notifications');
      }
    );
  }
}
