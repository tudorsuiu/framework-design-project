import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { UserMainPageComponent } from './pages/user-main-page/user-main-page.component';
import { AuthInterceptor } from './utils/interceptors/auth.interceptor';
import { UserCarsPageComponent } from './pages/user-cars-page/user-cars-page.component';
import { UserBillsPageComponent } from './pages/user-bills-page/user-bills-page.component';
import { UserEditPageComponent } from './pages/user-edit-page/user-edit-page.component';
import { EditCarModalComponent } from './components/edit-car-modal/edit-car-modal.component';
import { EditReparationModalComponent } from './components/edit-reparation-modal/edit-reparation-modal.component';
import { MechanicMainPageComponent } from './pages/mechanic-main-page/mechanic-main-page.component';
import { MechanicHeaderComponent } from './components/mechanic-header/mechanic-header.component';
import { AdministratorMainPageComponent } from './pages/administrator-main-page/administrator-main-page.component';
import { AdministratorHeaderComponent } from './components/administrator-header/administrator-header.component';
import { AdministratorAddMechanicPageComponent } from './pages/administrator-add-mechanic-page/administrator-add-mechanic-page.component';
import { DeleteConfirmationModalComponent } from './components/delete-confirmation-modal/delete-confirmation-modal.component';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        LoginPageComponent,
        RegisterPageComponent,
        UserMainPageComponent,
        UserCarsPageComponent,
        UserBillsPageComponent,
        UserEditPageComponent,
        EditCarModalComponent,
        EditReparationModalComponent,
        MechanicMainPageComponent,
        MechanicHeaderComponent,
        AdministratorMainPageComponent,
        AdministratorHeaderComponent,
        AdministratorAddMechanicPageComponent,
        DeleteConfirmationModalComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgbModule,
        BrowserAnimationsModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        ToastrModule.forRoot({
            timeOut: 2000,
            progressBar: true,
            positionClass: 'toast-bottom-center',
            preventDuplicates: true,
        }),
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
