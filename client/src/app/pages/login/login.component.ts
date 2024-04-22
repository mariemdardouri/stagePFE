import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink} from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm!:FormGroup;

  constructor(private router:Router, private authService:AuthService){}

ngOnInit():void{

  this.setForm();
}

setForm(){
  this.loginForm = new FormGroup({
    email: new FormControl('',[Validators.required]),
    password: new FormControl('',[Validators.required])
  })
}

submit(){
  console.log(this.loginForm.value);
  if  (this.loginForm.valid){
    this.authService.loginUser(this.loginForm.value).subscribe({next:(resp:any)=>{
      console.log(resp);
      localStorage.setItem("token", resp.token);
      localStorage.setItem('role',resp.role);
      this.authService.getUserInfo().subscribe({next:(userInfo:any)=>{
        console.log(userInfo,"tttt");
        if(userInfo.token.role === 'admin'){
          this.router.navigate(['admin']);
        }else if(userInfo.token.role === 'fournisseur'){
          this.router.navigate(['fournisseur'])
        }
      },error : (err)=> {
        console.log(err);
        if(err.status == 500){
          alert(err.error.msg);
        }
      }
      });
        alert('Login Successfull!')
    },error:(err)=>{
      console.log(err);
      if(err.status==500){
        alert(err.error.msg)
      }
    }
  })
  }
    
}

}
