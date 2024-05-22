import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { RegisterComponent } from '../register/register.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule,RouterOutlet, RouterModule, RegisterComponent, FormsModule, ReactiveFormsModule,],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  profileForm!: FormGroup;
  initialProfileData: any={};

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private toast: ToastrService
  ) {}
  
  ngOnInit(): void {
    this.setForm();
    this.loadUserProfile();
   
  }
  setForm(){
    this.profileForm = new FormGroup(
      {
      firstName : new FormControl({value:'',disabled:true}) ,
      lastName : new FormControl({value:'',disabled:true})   ,
      cin : new FormControl({value:'',disabled:true}) ,
      email : new FormControl('')  ,
      phoneNumber : new FormControl('')   ,
      password :new FormControl('')  ,
      confirmPassword : new FormControl(''),
    },
    {validators:this.matchpassword})
  }

  matchpassword : ValidatorFn =(control : AbstractControl):ValidationErrors | null =>{
    const password = control.get('password')?.value;
    const confirmpassword = control.get('confirmPassword')?.value ;
   
   return password === confirmpassword ? null: {passwordmatcherror: true};  
   }
   
   
   getUpdatedFields(): any {
     const updatedFields: any = {};
     Object.keys(this.profileForm.controls).forEach(key => {
       const control = this.profileForm.get(key);
       if (control && control.value !== this.initialProfileData[key]) {
         updatedFields[key] = control.value;
       }
     });
     return updatedFields;
   }
   
  loadUserProfile(): void {
    this.userService.getUserProfile().subscribe({
      next: (response) => {
        if (response.success) {
          console.log(response)
          this.initialProfileData = response.user;
          this.profileForm.patchValue(this.initialProfileData);
        } else {
          console.error('Error fetching profile data:', response.message);
        }
      },
      error: (error) => {
        console.error('Error fetching profile data:', error);
      }
    });
  }

  updateProfile(): void {
      const updatedData = this.getUpdatedFields();
      console.log(updatedData,'updatedData');
      this.userService.updateProfile(updatedData).subscribe({
        next: (resp) => {
          if (resp.success) {
            console.log(resp);
            this.toast.success(resp.message);
          } else {
            this.toast.error(resp.message);
          }
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour du profil:', err);
          this.toast.error('Erreur lors de la mise à jour du profil');
        }
      });
    
  }
}
