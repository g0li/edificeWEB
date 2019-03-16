import { UserAuthGuard } from './guards/user-auth.guard';
import { CreateComplaintComponent } from './pages/user-complaints/create-complaint/create-complaint.component';
import { UserMaintenanceComponent } from './pages/user-maintenance/user-maintenance.component';
import { UserLoginComponent } from './auth/user-login/user-login.component';

import { AuthGuard } from './guards/auth.guard';
import { RegisterComponent } from './auth/register/register.component';
import { MaintenanceListComponent } from './pages/maintenance/maintenance-list/maintenance-list.component';
import { EditComplaintsComponent } from './pages/complaints/edit-complaints/edit-complaints.component';
import { ComplaintsComponent } from './pages/complaints/complaints.component';
import { CreateUserComponent } from './pages/users/create-user/create-user.component';
import { UsersComponent } from './pages/users/users.component';
import { MaintenanceComponent } from './pages/maintenance/maintenance.component';
import { CreateComponent } from './pages/notice/create/create.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NoticeComponent } from './pages/notice/notice.component';
import { LoginComponent } from './auth/login/login.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { UserComplaintsComponent } from './pages/user-complaints/user-complaints.component';

const appRoutes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'edficeRegistration', component: RegisterComponent},
  {
    path: '',
    canActivateChild: [UserAuthGuard],
    children: [
      {path: 'userProfile', component: UserProfileComponent},
      {path: 'userMaintenance', component: UserMaintenanceComponent},
      {path: 'userComplaints', component: UserComplaintsComponent},
      {path: 'userCreateComplaints', component: CreateComplaintComponent},
    ]
  },
  {path: 'notice', component: NoticeComponent},
  {
    path: '',
    canActivateChild: [AuthGuard],
    children: [
      {path: 'noticeCreate', component: CreateComponent},
      {path: 'editNotice/:id', component: CreateComponent},
      {path: 'maintenance', component: MaintenanceComponent},
      {path: 'maintenanceList', component: MaintenanceListComponent},
      {path: 'users', component: UsersComponent},
      {path: 'createUser', component: CreateUserComponent},
      {path: 'editUser/:id', component: CreateUserComponent},
      {path: 'complaints', component: ComplaintsComponent},
      {path: 'editcomplaints', component: EditComplaintsComponent},
      {path: 'editComplaint/:id:mainid', component: EditComplaintsComponent}
        ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }
