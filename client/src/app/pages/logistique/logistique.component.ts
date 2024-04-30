import { Component } from '@angular/core';
import { MaterielService } from '../../services/materiel.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-logistique',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule,RouterOutlet,CommonModule,FormsModule],
  templateUrl: './logistique.component.html',
  styleUrl: './logistique.component.css'
})
export class LogistiqueComponent {
  materielList:any[]=[];
  
  
  constructor ( private materielService : MaterielService, private  toast:ToastrService){}
  ngOnInit():void {
    this.getAllMateriels(); 
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
