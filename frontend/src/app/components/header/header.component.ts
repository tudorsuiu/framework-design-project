import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
})
export class HeaderComponent {
    constructor(public authenticationService: AuthenticationService) {}
}
