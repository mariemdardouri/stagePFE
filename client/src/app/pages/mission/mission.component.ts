import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MissionService } from '../../services/mission.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterPipe } from '../../filter.pipe';

@Component({
  selector: 'app-mission',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    RouterOutlet,
    CommonModule,
    NgxPaginationModule,
    FilterPipe,
  ],
  templateUrl: './mission.component.html',
  styleUrl: './mission.component.css',
})
export class MissionComponent {
  missionList: any[] = [];
  users: any[] = [];
  missionForm!: FormGroup;
  selectedMission: any = {};
  agentLogistique: any;
  p: number = 1;
  searchText: string = '';
  
  constructor(
    private missionService: MissionService,
    private authService: AuthService,
    private userService: UserService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.setForm();
    this.getAllMissions();
    this.getAgents();
  }

  setForm(): void {
    this.missionForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      place: new FormControl('', [Validators.required]),
      hour: new FormControl('', [Validators.required]),
      dateStart: new FormControl('', [Validators.required]),
      dateEnd: new FormControl('', [Validators.required]),
      agentLogistique: new FormControl('', [Validators.required]),
    });
  }

  submit(): void {
    if (this.missionForm.valid) {
      const missionData = this.missionForm.value;
      const selectedAgent = this.users.find((user) => user._id === missionData.agentLogistique);

      if (selectedAgent) {
        missionData.assignedTo = selectedAgent._id;
        this.missionService.addMission(missionData).subscribe({
          next: (resp: any) => {
            if (resp.success) {
              this.toast.success(resp.message);
              this.getAllMissions();
            } else {
              this.toast.error(resp.message);
            }
          },
          error: (err) => {
            console.error(err);
            if (err.status === 500) {
              this.toast.error("Erreur lors de l'ajout de la mission");
            }
          },
        });
      } else {
        this.toast.error("Erreur lors de la sélection de l'agent logistique");
      }
    } else {
      this.toast.error('Veuillez remplir tous les champs obligatoires.');
    }
  }
  getAgents(): void {
    this.userService.getAgentsWithRole().subscribe(
      (data: any[]) => {
        this.users = data;
        this.getAllMissions();
      },
      (error) => {
        console.error('Erreur lors de la récupération des agents :', error);
      }
    );
  }
  getAllMissions(): void {
    this.missionService.getMissions().subscribe(
      (data: any[]) => {
        console.log(data, 'data');
        this.missionList = data.map(mission => {
          const agent = this.users.find(user => user._id === mission.agentLogistique);
          return {
            ...mission,
            agentLogistique: agent ? `${agent.firstName} ${agent.lastName}` : 'Unknown'
          };
        });
        console.log(data, 'missionList');
      },
      (error) => {
        console.error('Erreur lors de la récupération des agents ::', error);
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
          console.error('Erreur lors de la mise à jour du materiel:', err);
          if (err.status === 500) {
            this.toast.error('Erreur lors de la mise à jour du materiel');
          }
        },
      });
    }
  }

  openDeleteModal(mission: any): void {
    this.selectedMission = mission;
  }

  deleteMission(): void {
    if(this.selectedMission){
      this.missionService.deleteMission(this.selectedMission).subscribe({
        next: (resp: any) => {
          if (resp.success) {
            this.toast.success(resp.message);
            this.getAllMissions();
          } else {
            this.toast.error(resp.message);
          }
        },
        error: (err) => {
          console.error('Erreur lors de la suppression du materiel:', err);
          if (err.status === 500) {
            this.toast.error('Erreur lors de la suppression du materiel');
          }
        },
      });
    }
  }
}
