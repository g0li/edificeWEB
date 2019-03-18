import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './Services/auth.service';
import { MaintenanceService } from './Services/maintenance.service';
import { ComplaintsService } from './Services/complaints.service';
import { NoticeService } from './Services/notice.service';
import { AlertifyService } from './Services/alertify.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TemplateComponent } from './template/template.component';
import { NoticeComponent } from './pages/notice/notice.component';
import { AppRoutingModule } from './/app-routing.module';
import { CreateComponent } from './pages/notice/create/create.component';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { ModalModule } from 'ngx-bootstrap';
import { MaintenanceComponent } from './pages/maintenance/maintenance.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CreateUserComponent } from './pages/users/create-user/create-user.component';
import { UsersComponent } from './pages/users/users.component';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from './Services/users.service';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from 'src/environments/environment';
import { ComplaintsComponent } from './pages/complaints/complaints.component';
import { EditComplaintsComponent } from './pages/complaints/edit-complaints/edit-complaints.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { MaintenanceListComponent } from './pages/maintenance/maintenance-list/maintenance-list.component';
import { RegisterComponent } from './auth/register/register.component';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { LoginComponent } from './auth/login/login.component';
import { UserLoginComponent } from './auth/user-login/user-login.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { UserLoginService } from './Services/user-login.service';
import { UserMaintenanceComponent } from './pages/user-maintenance/user-maintenance.component';
import { UserComplaintsComponent } from './pages/user-complaints/user-complaints.component';
import { CreateComplaintComponent } from './pages/user-complaints/create-complaint/create-complaint.component';
import { TestTemplateComponent } from './test-template/test-template.component';
import { UserUserListComponent } from './pages/user-user-list/user-user-list.component';

@NgModule({
  declarations: [
    AppComponent,
    TemplateComponent,
    NoticeComponent,
    CreateComponent,
    MaintenanceComponent,
    CreateUserComponent,
    UsersComponent,
    ComplaintsComponent,
    EditComplaintsComponent,
    MaintenanceListComponent,
    RegisterComponent,
    LoginComponent,
    UserLoginComponent,
    UserProfileComponent,
    UserMaintenanceComponent,
    UserComplaintsComponent,
    CreateComplaintComponent,
    TestTemplateComponent,
    UserUserListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    NgxPaginationModule
  ],
  providers: [
    UserService,
    AlertifyService,
    NoticeService,
    ComplaintsService,
    MaintenanceService,
    AuthService,
    AuthGuard,
    UserLoginService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
