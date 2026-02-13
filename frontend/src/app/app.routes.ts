import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { PlanningListComponent } from './pages/planning/planning-list.component';
import { PlanningFormComponent } from './pages/planning/planning-form.component';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    component: DashboardComponent
  },
  {
    path: 'plannings',
    canActivate: [AuthGuard],
    component: PlanningListComponent
  },
  {
    path: 'plannings/create',
    canActivate: [AuthGuard],
    component: PlanningFormComponent
  },
  {
    path: 'plannings/edit/:id',
    canActivate: [AuthGuard],
    component: PlanningFormComponent
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
