import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';

export const routes: Routes = [
    {path:'login', component:LoginComponent},
    {path:'layout', component:LayoutComponent},
    

];
