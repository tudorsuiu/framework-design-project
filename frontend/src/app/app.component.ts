import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { AuthenticationService } from './services/authentication-service/authentication.service';
import { TOKEN_CONSTANT } from './constants/token';
import { isPlatformBrowser } from '@angular/common';
import { MECHANICS_KEY, USERS_KEY } from './constants/cookie-keys';
import { UserService } from './services/user-service/user.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
    title = 'frontend';

    private readonly platformId = inject(PLATFORM_ID);

    constructor(
        private authenticationService: AuthenticationService,
        private userService: UserService
    ) {}

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            const token = sessionStorage.getItem(TOKEN_CONSTANT);

            this.authenticationService.getLoggedInUser(token).subscribe(
                () => {},
                () => {
                    sessionStorage.removeItem(TOKEN_CONSTANT);
                }
            );

            const mechanics = sessionStorage.getItem(MECHANICS_KEY);
            const users = sessionStorage.getItem(USERS_KEY);

            if (mechanics !== null && mechanics !== undefined) {
                this.userService.mechanics = JSON.parse(mechanics);
            }

            if (users !== null && users !== undefined) {
                this.userService.users = JSON.parse(users);
            }
        }
    }
}
