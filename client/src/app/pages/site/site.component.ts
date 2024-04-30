import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-site',
  standalone: true,
  imports: [FormsModule , ReactiveFormsModule, RouterModule,RouterOutlet,CommonModule],
  templateUrl: './site.component.html',
  styleUrl: './site.component.css'
})
export class SiteComponent {
  userRegForm!:FormGroup ;
  
  constructor(private userService : UserService ,private register:AuthService, private  toast:ToastrService){
    
  }

  ngOnInit():void{
     this.setForm();
     this.userService.getAllUser();
  }

setForm(){
  this.userRegForm = new FormGroup(
    {
      firstName : new FormControl('',[Validators.required]) ,
      lastName : new FormControl('',[Validators.required])   ,
    cin : new FormControl('',[Validators.required, Validators.minLength(8),Validators.maxLength(8)])  ,
    email : new FormControl('',[Validators.required , Validators.email])  ,
    phoneNumber : new FormControl('',[Validators.required , Validators.minLength(8),Validators.maxLength(8)])   ,
    role :new FormControl('',[Validators.required])  ,
    password :new FormControl('',[Validators.required])   ,
    isAdmin : new FormControl('',[Validators.required , Validators.minLength(8)]) ,
    confirmPassword : new FormControl('',[Validators.required , Validators.minLength(8)]),
  })
}

}
