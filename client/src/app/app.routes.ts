import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { UserListComponent } from './pages/admin/user-list/user-list.component';
import { AuthGuard } from './services/auth.guard';
import { RegisterComponent } from './pages/register/register.component';
import { FournisseurComponent } from './pages/fournisseur/fournisseur.component';
import { DeploiementComponent } from './pages/deploiement/deploiement.component';
import { ApproComponent } from './pages/appro/appro.component';
import { LogistiqueComponent } from './pages/logistique/logistique.component';
import { AgentLogistiqueComponent } from './pages/agent-logistique/agent-logistique.component';
import { SiteComponent } from './pages/site/site.component';
import { AgentComponent } from './pages/agent/agent.component';
import { RequestComponent } from './pages/request/request.component';
import { MissionComponent } from './pages/mission/mission.component';

export const routes: Routes = [
    
    {path:'login', component:LoginComponent},
    {
        path:'',component: LayoutComponent,canActivate:[AuthGuard],
        children:[
            {path:'admin',component: UserListComponent},
            {path:'admin/request',component: RequestComponent},
            {path:'admin/register',component:RegisterComponent},
            {path:'fournisseur',component: FournisseurComponent},
            {path:'deploiement',component: DeploiementComponent},
            {path:'approvisionnement',component: ApproComponent},
            {path:'logistique',component: LogistiqueComponent},
            {path:'logistique/mission',component: MissionComponent},
            {path:'agentLogistique',component: AgentLogistiqueComponent},
            {path:'responsableSite',component: SiteComponent},
            {path:'agent',component: AgentComponent},
        ]
    },
    

];
