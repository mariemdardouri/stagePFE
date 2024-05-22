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
        password: new FormControl('', [Validators.required]),
        confirmPassword: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
      },
      { validators: this.matchpassword }
    );
  }

  Register() {
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
  }

  matchpassword: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmpassword = control.get('confirmPassword')?.value;

    return password === confirmpassword ? null : { passwordmatcherror: true };
  };
}
