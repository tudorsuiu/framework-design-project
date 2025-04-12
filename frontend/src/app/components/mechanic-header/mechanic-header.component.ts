import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';

@Component({
    selector: 'app-mechanic-header',
    templateUrl: './mechanic-header.component.html',
    styleUrl: './mechanic-header.component.scss',
})
export class MechanicHeaderComponent {
    constructor(public authenticationService: AuthenticationService) {}
}
