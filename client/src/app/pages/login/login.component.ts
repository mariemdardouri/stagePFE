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
      this.router.navigate(['admin']).then(()=>{
        alert('Login Successfull!')
      })
    },error:(err)=>{
      console.log(err);
      if(err.status==500){
        alert(err.error.msg)
      }
    }
  })
  }
    /*if  (this.loginForm.valid){
      const loginData = this.loginForm.value;
      console.log('Form Data:',loginData);
      
      this.http.post('/api/auth/login', loginData).subscribe((data:any)=>{
      localStorage.setItem("token", data.token);
      console.log('token stored:',localStorage.getItem("token"));
      
      if (this.isAdmin(data)) {
        this.router.navigate(['admin']);
      } else {
        this.router.navigate(['user'])
      }
    }, (error)=>{console.error('Error during login',error)});
    }else{
      console.log('form is invalid. Form data:',this.loginForm.value)
      alert("Please fill out all fields")
    }
    
}

// Helper function to check user type after logging in
isAdmin(data: any):boolean{
  return data && data["role"] === "admin";
}*/
}
}
