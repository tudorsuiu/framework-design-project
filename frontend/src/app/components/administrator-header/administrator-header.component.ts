import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';
import { Roles } from '../../enums/roles';
import { ToastService } from '../../services/toast-service/toast.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-administrator-header',
    templateUrl: './administrator-header.component.html',
    styleUrl: './administrator-header.component.scss',
})
export class AdministratorHeaderComponent {
    constructor(public authenticationService: AuthenticationService) {}
}
