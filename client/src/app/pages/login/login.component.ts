import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm!: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.setForm();
  }

  setForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  submit() {
    console.log(this.loginForm.value);
    if (this.loginForm.valid) {
      this.authService.loginUser(this.loginForm.value).subscribe({
        next: (resp: any) => {
          console.log(resp);
          if (resp.success) {
            localStorage.setItem('token', resp.token);
            localStorage.setItem('role', resp.role);
            this.authService.getUserInfo().subscribe({
              next: (userInfo: any) => {
                console.log(userInfo, 'uuuu');
                if (userInfo.success === false) {
                  this.toast.error('This account is desactivated');
                } else {
                  this.toast.success(resp.message);
                  if (userInfo.token.role === 'admin') {
                    this.router.navigate(['admin']);
                  } else if (userInfo.token.role === 'fournisseur') {
                    this.router.navigate(['fournisseur']);
                  } else if (userInfo.token.role === 'deploiement') {
                    this.router.navigate(['deploiement']);
                  } else if (userInfo.token.role === 'approvisionnement') {
                    this.router.navigate(['approvisionnement']);
                  } else if (userInfo.token.role === 'logistique') {
                    this.router.navigate(['logistique']);
                  } else if (userInfo.token.role === 'agentLogistique') {
                    this.router.navigate(['agentLogistique']);
                  } else if (userInfo.token.role === 'responsableSite') {
                    this.router.navigate(['responsableSite']);
                  } else if (userInfo.token.role === 'agent') {
                    this.router.navigate(['agent']);
                  }
                }
              },
              error: (err) => {
                console.log(err);
              },
            });
          } else {
            this.toast.error(resp.message);
          }
        },
        error: (err) => {
          console.log(err);
          if (err.status === 500) {
            this.toast.error('Erreur de connexion');
          }
        },
      });
    }
  }
}
