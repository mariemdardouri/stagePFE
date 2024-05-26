import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    RouterOutlet,
    CommonModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  userRegForm!: FormGroup;
  userList: any = [];
  constructor(
    private userService: UserService,
    private register: AuthService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.setForm();
    this.userService.getAllUser();
  }

  setForm() {
    this.userRegForm = new FormGroup(
      {
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        cin: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(8),
        ]),
        email: new FormControl('', [Validators.required, Validators.email]),
        phoneNumber: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(8), 
        ]),
        role: new FormControl('', [Validators.required]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          this.strongPasswordValidator(),
        ]),
        confirmPassword: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          this.matchPasswordValidator(),
        ]),
      },
    );
  }

  Register() {
    if (this.userRegForm.valid) {
      
      console.log(this.userRegForm.value);
      this.register.registerUser(this.userRegForm.value).subscribe({
        next: (resp: any) => {
          console.log(resp);
          if (resp.success) {
            this.toast.success(resp.message);
            this.userService.getAllUser();
          } else {
            this.toast.error(resp.message);
          }
        },
        error: (err) => {
          console.log(err);
          if (err.status === 500) {
            this.toast.error('Erreur de connexion');
            this.toast.error("Erreur lors de l'enregistrement");
          }
        },
      });
    } else {
      this.toast.error('Veuillez corriger les erreurs dans le formulaire avant de soumettre.');
    }
  }

  matchPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.root.get('password')?.value;
      const confirmPassword = control.value;
      return password === confirmPassword ? null : { passwordMismatch: true };
    };
  }
  strongPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumeric = /[0-9]/.test(value);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);

      const isValid =
        hasUpperCase && hasLowerCase && hasNumeric && hasSpecial;
      return !isValid ? { strongPassword: true } : null;
    };
  }

  strongPassword(event: any) {
    const pattern = /[a-zA-Z0-9@#$%^&*(),.?":{}|<>]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  /*matchPassword(event: any) {
    const password = this.userRegForm.get('password')?.value;
    const confirmPassword = this.userRegForm.get('confirmPassword')?.value;
    const inputChar = String.fromCharCode(event.charCode);
  
    if (password && confirmPassword) {
      if (inputChar) {
        if (password !== confirmPassword) {
          event.preventDefault();
        }
      }
    }
  }*/
  
  

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
}
