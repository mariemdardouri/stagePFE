import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'admin', component: UserListComponent },
      { path: 'admin/register', component: RegisterComponent },
      { path: 'fournisseur', component: FournisseurComponent },
      { path: 'deploiement', component: DeploiementComponent },
      { path: 'approvisionnement', component: ApproComponent },
      { path: 'logistique', component: LogistiqueComponent },
      { path: 'agentLogistique', component: AgentLogistiqueComponent },
      { path: 'responsableSite', component: SiteComponent },
      { path: 'agent', component: AgentComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
