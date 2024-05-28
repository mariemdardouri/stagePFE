import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';
import { RegisterComponent } from '../../register/register.component';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterPipe } from "../../../filter.pipe";


@Component({
    selector: 'app-user-list',
    standalone: true,
    templateUrl: './user-list.component.html',
    styleUrl: './user-list.component.css',
    imports: [
        CommonModule,
        RouterOutlet,
        RouterModule,
        RegisterComponent,
        FormsModule,
        ReactiveFormsModule,
        NgxPaginationModule,
        FilterPipe
    ]
})
export class UserListComponent {
  displayedColumns: string[] = [
    'Nom',
    'Prénom',
    'CIN',
    'Email',
    'NumTél',
    'Role',
    'Statut',
    'Actions',
  ];
  selectedUser: any = {};
  userList: any[] = [];
  userRegForm!: FormGroup;
  p: number = 1;
  searchText: string = '';

  constructor(private userService: UserService, private toast: ToastrService,private register: AuthService,) {}

  ngOnInit(): void {
    this.setForm();
    this.getAllUsers();
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
            this.getAllUsers();
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
  getAllUsers(): void {
    this.userService.getAllUser().subscribe(
      (data: any[]) => {
        this.userList = data.filter((user: any) => user.role !== 'admin');
      },
      (error) => {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
      }
    );
  }

  editUser(user: any): void {
    this.selectedUser = user;
  }

  updateUser(): void {
    if (this.selectedUser) {
      this.userService.updateUser(this.selectedUser).subscribe({
        next: (resp: any) => {
          if (resp.success) {
            this.toast.success(resp.message);
            this.getAllUsers();
            this.selectedUser = {};
          } else {
            this.toast.error(resp.message);
          }
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour de l\'utilisateur:', err);
          if (err.status === 500) {
            this.toast.error("Erreur lors de la mise à jour de l'utilisateur");
          }
        },
      });
    }
  }

  desactivateUser(userId: string): void {
    this.userService.desactivateUser(userId).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.toast.success(resp.message);
          this.getAllUsers();
        } else {
          this.toast.error(resp.message);
        }
      },
      error: (err) => {
        console.error('Erreur lors du desactivation de l\'utilisateur:', err);
        if (err.status === 500) {
          this.toast.error("Erreur lors du desactivation de l'utilisateur");
        }
      },
    });
  }

  activateUser(userId: string): void {
    this.userService.activateUser(userId).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.toast.success(resp.message);
          this.getAllUsers();
        } else {
          this.toast.error(resp.message);
        }
      },
      error: (err) => {
        console.error('Erreur lors du l\'activation de l\'utilisateur:', err);
        if (err.status === 500) {
          this.toast.error("Erreur lors du l\'activation de l'utilisateur");
        }
      },
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

}
