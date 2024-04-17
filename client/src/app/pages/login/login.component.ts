import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink} from '@angular/router';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm!:FormGroup;

  constructor(private router:Router, private login:LoginService){}

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
    this.login.loginUser(this.loginForm.value).subscribe({next:(resp:any)=>{
      console.log(resp);
      localStorage.setItem("token", resp.token);
      localStorage.setItem("role", resp.role);
      if(resp.role === 'admin'){
        this.router.navigate(['admin']);
      }else if(resp.role === "user"){
        this.router.navigate(['home'])
      }
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
