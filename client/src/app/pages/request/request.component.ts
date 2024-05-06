import { Component } from '@angular/core';
import { RequestService } from '../../services/request.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-request',
  standalone: true,
  imports: [CommonModule , RouterOutlet, RouterModule,FormsModule , ReactiveFormsModule,],
  templateUrl: './request.component.html',
  styleUrl: './request.component.css'
})
export class RequestComponent {

  displayedColumns: string[] = ['Nom', 'Prénom', 'CIN', 'Email', 'NumTél', 'Role', 'Action'];
  selectedUser:any = {};
  userRequests:any[]=[];
  constructor ( private requestService : RequestService, private  toast:ToastrService){}
  
  ngOnInit():void {
    this.loadUserRequests(); 
  }

  loadUserRequests(): void {
    this.requestService.getAllRequest().subscribe(requests => {
      this.userRequests = requests;
    });
  }

  acceptRequest(userId: string): void {
    this.requestService.acceptUserRequest(userId).subscribe(() => {
      // After accepting the request, update the userRequests list or fetch the updated list
      this.loadUserRequests();
    });
  }
}
