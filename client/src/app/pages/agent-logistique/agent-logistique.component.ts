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
  selector: 'app-agent-logistique',
  standalone: true,
  imports: [ReactiveFormsModule,RouterModule,RouterOutlet,CommonModule,FormsModule,NgxPaginationModule,FilterPipe],
  templateUrl: './agent-logistique.component.html',
  styleUrl: './agent-logistique.component.css',
})
export class AgentLogistiqueComponent {
  userMissions: any[] = [];
  users: any[] = [];
  p: number = 1;
  searchText: string = '';

  constructor(
    private missionService: MissionService,
    private authService: AuthService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchUserMissions();
  }

  fetchUserMissions(): void {
    this.missionService.getUserMissions().subscribe(
      (missions: any[]) => {
        this.userMissions = missions;
        console.log(missions, 'userMissions');
      },
      (error) => {
        console.error('Erreur lors de la récupération des missions :', error);
        this.toast.error('Erreur lors de la récupération des missions');
      }
    );
  }

  validateMission(mission: any): void {
    
    this.missionService.validMission(mission).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.toast.success('Mission validée avec succès');
          this.fetchUserMissions();
        } else {
          this.toast.error(resp.message);
        }
      },
      error:(error) => {
        console.error('Erreur lors de la validation de la mission:', error);
        this.toast.error('Erreur lors de la validation de la mission');
      }
  });
  }
  rejectMission(mission: any): void {
    
    this.missionService.rejectMission(mission).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.toast.success('Mission rejetée avec succès');
          this.fetchUserMissions();
        } else {
          this.toast.error(resp.message);
        }
      },
      error:(error) => {
        console.error('Erreur lors de la rejection de la mission:', error);
        this.toast.error('Erreur lors de la rejection de la mission');
      }
  });
  }
}
