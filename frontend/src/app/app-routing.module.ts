import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from '../app/pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { UserMainPageComponent } from './pages/user-main-page/user-main-page.component';
import { UserCarsPageComponent } from './pages/user-cars-page/user-cars-page.component';
import { UserBillsPageComponent } from './pages/user-bills-page/user-bills-page.component';
import { UserEditPageComponent } from './pages/user-edit-page/user-edit-page.component';
import { MechanicMainPageComponent } from './pages/mechanic-main-page/mechanic-main-page.component';
import { AdministratorMainPageComponent } from './pages/administrator-main-page/administrator-main-page.component';
import { AdministratorAddMechanicPageComponent } from './pages/administrator-add-mechanic-page/administrator-add-mechanic-page.component';
import { authGuard } from './utils/guards/auth.guard';

const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: '/login' },
    { path: 'login', component: LoginPageComponent },
    { path: 'register', component: RegisterPageComponent },
    {
        path: 'user-main-page',
        canActivate: [authGuard],
        component: UserMainPageComponent,
    },
    {
        path: 'user-cars-page',
        canActivate: [authGuard],
        component: UserCarsPageComponent,
    },
    {
        path: 'user-bills-page',
        canActivate: [authGuard],
        component: UserBillsPageComponent,
    },
    {
        path: 'user-edit-page',
        canActivate: [authGuard],
        component: UserEditPageComponent,
    },
    {
        path: 'mechanic-main-page',
        canActivate: [authGuard],
        component: MechanicMainPageComponent,
    },
    {
        path: 'administrator-main-page',
        canActivate: [authGuard],
        component: AdministratorMainPageComponent,
    },
    {
        path: 'administrator-add-mechanic-page',
        canActivate: [authGuard],
        component: AdministratorAddMechanicPageComponent,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
