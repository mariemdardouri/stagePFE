import { Component } from '@angular/core';
import { MaterielService } from '../../services/materiel.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fournisseur',
  standalone: true,
  imports: [FormsModule , ReactiveFormsModule, RouterModule,RouterOutlet,CommonModule],
  templateUrl: './fournisseur.component.html',
  styleUrl: './fournisseur.component.css'
})
export class FournisseurComponent {

  materielList:any[]=[];
  materielForm!:FormGroup ;

  constructor ( private materielService : MaterielService){}

  ngOnInit():void {
    this.setForm();
    this.getAllMateriels(); 
  }

  setForm(): void{
    this.materielForm = new FormGroup({
      categorie: new FormControl('',[Validators.required]),
      nature: new FormControl('',[Validators.required]),
      numero: new FormControl('',[Validators.required]),
    })
  }

  submit(): void{
    console.log(this.materielForm.value)
    this.materielService.addMateriel(this.materielForm.value).subscribe({next:(resp:any)=>{
    console.log(resp);
  }
  })
  }
  getAllMateriels():void{
    this.materielService.getMateriels().subscribe(
      (data: any[]) => {
        console.log(data,'data');
        this.materielList = data;
        console.log(data,'materielList');
        
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }
}
