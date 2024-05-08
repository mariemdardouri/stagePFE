import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MissionService } from '../../services/mission.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mission',
  standalone: true,
  imports: [FormsModule , ReactiveFormsModule, RouterModule,RouterOutlet,CommonModule],
  templateUrl: './mission.component.html',
  styleUrl: './mission.component.css'
})
export class MissionComponent {
  missionList:any[]=[];
  missionForm!:FormGroup ;
  selectedMission:any = {};
  constructor ( private missionService : MissionService, private  toast:ToastrService){}

  ngOnInit():void {
    this.setForm();
    this.getAllMissions(); 
  }

  setForm(): void{
    this.missionForm = new FormGroup({
      title: new FormControl('',[Validators.required]),
      place: new FormControl('',[Validators.required]),
      hour: new FormControl('',[Validators.required]),
      dateStart: new FormControl('',[Validators.required]),
      dateEnd: new FormControl('',[Validators.required]),
      agent: new FormControl('',[Validators.required]),
    })
  }

  submit(): void{
    console.log(this.missionForm.value)
    this.missionService.addMission(this.missionForm.value).subscribe({next:(resp:any)=>{
    console.log(resp);
    if(resp.success){
      this.toast.success(resp.message);
      this.getAllMissions();
    }else{
      this.toast.error(resp.message);
    }
  }, error:(err) => {
    console.log(err);
      if (err.status === 500) {
        this.toast.error('Erreur lors de l\'ajout du mission');
      }
  } 
  })
 }
  getAllMissions():void{
    this.missionService.getMissions().subscribe(
      (data: any[]) => {
        console.log(data,'data');
        this.missionList = data;
        console.log(data,'missionList');
        
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }


  editMission(mission: any): void {
    this.selectedMission = mission;
  }

  updateMission(): void {
    if (this.selectedMission) {
      this.missionService.updateMission(this.selectedMission).subscribe({
        next: (resp: any) => {
          if (resp.success) {
            this.toast.success(resp.message);
            this.getAllMissions();
            this.selectedMission = {};
          } else {
            this.toast.error(resp.message);
          }
        },
        error: (err) => {
          console.error('Error updating materiel:', err);
          if (err.status === 500) {
            this.toast.error('Erreur lors de la mise à jour du materiel');
          }
        }
      });
    }
  }

  deleteMission(mission:any): void {
      this.missionService.deleteMission(mission).subscribe({
        next: (resp: any) => {
          if (resp.success) {
            this.toast.success(resp.message);
            this.getAllMissions();
          } else {
            this.toast.error(resp.message);
          }
        },
        error: (err) => {
          console.error('Error updating materiel:', err);
          if (err.status === 500) {
            this.toast.error('Erreur lors de la suppression du materiel');
          }
        }
      });
  }
}
