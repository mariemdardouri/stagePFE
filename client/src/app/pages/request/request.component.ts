import { Component } from '@angular/core';
import { RequestService } from '../../services/request.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-request',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './request.component.html',
  styleUrl: './request.component.css',
})
export class RequestComponent {
  displayedColumns: string[] = [
    'Nom',
    'Prénom',
    'CIN',
    'Email',
    'NuméroTél',
    'Role',
    'Statut',
    'Actionz',
  ];
  userRequests: any[] = [];
  constructor(
    private requestService: RequestService,
    private userService: UserService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadUserRequests();
  }

  loadUserRequests(): void {
    this.requestService.getAllRequest().subscribe((requests) => {
      this.userRequests = requests;
    });
  }

  acceptRequest(request: any): void {
    if (request) {
      console.log(request, 'iddddd');
      this.requestService.acceptUserRequest(request).subscribe({
        next: (resp: any) => {
          if (resp.success) {
            this.toast.success(resp.message);
            this.loadUserRequests();
          } else {
            this.toast.error(resp.message);
          }
        },
        error: (err) => {
          console.error("Erreur lors de l'acceptation de l'utilisateur:", err);
          if (err.status === 500) {
            this.toast.error("Erreur lors de l'acceptation de l'utilisateur");
          }
        },
      });
    }
  }
}
