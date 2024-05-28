import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { HttpClient } from '@angular/common/http';
import { RequestService } from '../../services/request.service';
import { PageEvent } from '@angular/material/paginator';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterPipe } from '../../filter.pipe';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-site',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    RouterOutlet,
    CommonModule,
    NgxPaginationModule,
    FilterPipe,
  ],
  templateUrl: './site.component.html',
  styleUrl: './site.component.css',
})
export class SiteComponent {
  userList: any[] = [];
  userForm!: FormGroup;
  selectedUser: any = {};
  file!: File;
  userId!:string;
  p: number = 1;
  searchText: string = '';

  constructor(private requestService: RequestService,
    private http: HttpClient,
    private toast: ToastrService,
    private authService: AuthService,
  ) {}

    ngOnInit():void{
      this.setForm();
      this.getAllRequest();
   }
 
 setForm(){
   this.userForm = new FormGroup(
     {
       firstName : new FormControl('',[Validators.required]) ,
       lastName : new FormControl('',[Validators.required])   ,
       cin : new FormControl('',[Validators.required, Validators.minLength(8),Validators.maxLength(8)])  ,
       email : new FormControl('',[Validators.required , Validators.email])  ,
       phoneNumber : new FormControl('',[Validators.required , Validators.minLength(8),Validators.maxLength(8)])   ,
       role :new FormControl('',[Validators.required])  ,
   })
 }

 getAllRequest(): void {
  this.requestService.getRequestByResponsableSite().subscribe((requests) => {
    this.userList = requests;
  });
} 


 submit(): void {
  console.log(this.userForm.value);
  this.requestService.addRequest(this.userForm.value).subscribe({
    next: (resp: any) => {
      console.log(resp);
      if (resp.success) {
        this.toast.success(resp.message);
        this.getAllRequest();
      } else {
        this.toast.error(resp.message);
      }
    },
    error: (err) => {
      console.log(err);
      if (err.status === 500) {
        this.toast.error("Erreur lors de l'ajout du demande");
      }
    },
  });
}

editRequest(request: any): void {
  this.selectedUser = request;
}

updateRequest(): void {
  if (this.selectedUser) {
    this.requestService.updateRequest(this.selectedUser).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.toast.success(resp.message);
          this.getAllRequest();
          this.selectedUser = {};
        } else {
          this.toast.error(resp.message);
        }
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du demande:', err);
        if (err.status === 500) {
          this.toast.error('Erreur lors de la mise à jour du demande');
        }
      },
    });
  }
}

deleteRequest(request: any): void {
  this.requestService.deleteRequest(request).subscribe({
    next: (resp: any) => {
      if (resp.success) {
        this.toast.success(resp.message);
        this.getAllRequest();
      } else {
        this.toast.error(resp.message);
      }
    },
    error: (err) => {
      console.error('Erreur lors de la suppression du demande:', err);
      if (err.status === 500) {
        this.toast.error('Erreur lors de la suppression du demande');
      }
    },
  });
}

uploadCSV() {

  this.requestService.uploadCSV(this.file, this.userId).subscribe({
    next: (response: any) => {
      console.log('Fichier téléchargé avec succès');
      console.log(response);
      if (response.success) {
        this.toast.success(response.message);
        this.getAllRequest();
      } else {
        this.toast.error(response.message);
      }
    },
    error: (error) => {
      console.error('Erreur lors du téléchargement du CSV:', error);
    }
  });
}

  onlyLetters(event: any) {
    const pattern = /[a-zA-Z]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  onlyNumbers(event: any) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  handlePageChange(event: PageEvent): void {
    this.p = event.pageIndex + 1; // Adjust as needed based on your pagination logic
  }
  onFileSelected(event: any) {
    this.file = event.target.files[0];
    this.updateFileName(event);
  }

  updateFileName(event: any): void {
    const input = event.target;
    const fileName = input.files.length ? input.files[0].name : 'Aucun fichier choisi';
    const fileNameElement = document.getElementById('fileName');
    if (fileNameElement) {
      fileNameElement.textContent = fileName;
    }
  }
}
