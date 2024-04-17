import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { UserListComponent } from './pages/admin/user-list/user-list.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
    
    {path:'login', component:LoginComponent},
    {
        path:'',component: LayoutComponent,
        children:[
            {path:'admin',component: UserListComponent}
        ]
    },
    

];
