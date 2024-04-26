import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { UserListComponent } from './pages/admin/user-list/user-list.component';
import { AuthGuard } from './services/auth.guard';
import { RegisterComponent } from './pages/register/register.component';
import { FournisseurComponent } from './pages/fournisseur/fournisseur.component';
import { DeploiementComponent } from './pages/deploiement/deploiement.component';

export const routes: Routes = [
    
    {path:'login', component:LoginComponent},
    {
        path:'',component: LayoutComponent,canActivate:[AuthGuard],
        children:[
            {path:'admin',component: UserListComponent},
            {path:'admin/register',component:RegisterComponent},
            {path:'fournisseur',component: FournisseurComponent},
            {path:'deploiement',component: DeploiementComponent},
        ]
    },
    

];
