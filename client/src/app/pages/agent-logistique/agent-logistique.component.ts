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

@Component({
  selector: 'app-agent-logistique',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, RouterOutlet, CommonModule],
  templateUrl: './agent-logistique.component.html',
  styleUrl: './agent-logistique.component.css',
})
export class AgentLogistiqueComponent {
  userMissions: any[] = [];
  users: any[] = [];
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
        console.error('Error fetching user missions:', error);
        this.toast.error('Error fetching user missions');
      }
    );
  }

  validateMission(mission: any): void {
    mission.status = "valider"; // Update the status to "Valider"
    this.missionService.updateMission(mission).subscribe(
      (updatedMission: any) => {
        this.toast.success("Mission valider avec succee");
        console.log("Mission validated successfully:", updatedMission);
        // Add any notification logic here
      },
      (error) => {
        console.error('Error updating mission:', error);
        this.toast.error('Error updating mission');
      }
    );
  }
}
