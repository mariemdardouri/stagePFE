
import { LoginComponent } from './pages/login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './pages/admin/user-list/user-list.component';
import { AuthGuard } from './services/auth.guard';
import { LayoutComponent } from './pages/layout/layout.component';
import { RegisterComponent } from './pages/register/register.component';
import { FournisseurComponent } from './pages/fournisseur/fournisseur.component';
import { DeploiementComponent } from './pages/deploiement/deploiement.component';
import { ApproComponent } from './pages/appro/appro.component';
import { LogistiqueComponent } from './pages/logistique/logistique.component';
import { SiteComponent } from './pages/site/site.component';
import { AgentLogistiqueComponent } from './pages/agent-logistique/agent-logistique.component';
import { AgentComponent } from './pages/agent/agent.component';
import { RequestComponent } from './pages/request/request.component';
import { MissionComponent } from './pages/mission/mission.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { ClaimComponent } from './pages/claim/claim.component';
import { LogistiqueClaimsComponent } from './pages/claim/logistique-claims/logistique-claims.component';
import { NgModule } from '@angular/core';
import { FournisseurClaimsComponent } from './pages/claim/fournisseur-claims/fournisseur-claims.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'notifications', component: NotificationsComponent },
      { path: 'admin', component: UserListComponent },
      { path: 'admin/registre', component: RegisterComponent },
      { path: 'admin/demande', component: RequestComponent },
      { path: 'fournisseur', component: FournisseurComponent },
      { path: 'fournisseur/réclamation', component: FournisseurClaimsComponent },
      { path: 'deploiement', component: DeploiementComponent },
      { path: 'approvisionnement', component: ApproComponent },
      { path: 'logistique', component: LogistiqueComponent },
      { path: 'logistique/mission', component: MissionComponent },
      { path: 'logistique/réclamation',component: LogistiqueClaimsComponent},
      { path: 'agentLogistique', component: AgentLogistiqueComponent },
      { path: 'responsableSite', component: SiteComponent },
      { path: 'agent', component: AgentComponent },
      { path: 'agent/réclamation',component: ClaimComponent},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})

export class AppRoutingModule {}
