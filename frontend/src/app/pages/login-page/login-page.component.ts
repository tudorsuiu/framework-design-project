import { Component } from '@angular/core';
import { ToastService } from '../../services/toast-service/toast.service';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';
import { User } from '../../models/entities/User';
import { Router } from '@angular/router';
import { Roles } from '../../enums/roles';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user-service/user.service';

@Component({
    selector: 'app-login-page',
    templateUrl: './login-page.component.html',
    styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
    private subscription: Subscription = new Subscription();

    loggingUserDetails = {
        email: '',
        password: '',
    };

    constructor(
        private toastService: ToastService,
        private authenticationService: AuthenticationService,
        private router: Router,
        private userService: UserService
    ) {}

    onLogin() {
        this.subscription.add(
            this.authenticationService
                .login(this.loggingUserDetails)
                .subscribe({
                    next: response => {
                        if (response.role === Roles.USER) {
                            this.router.navigateByUrl('user-main-page');
                            this.userService.InitMechanics();
                        } else if (response.role === Roles.MECHANIC) {
                            this.router.navigateByUrl('mechanic-main-page');
                            this.userService.InitUsers();
                        } else if (response.role === Roles.ADMINISTRATOR) {
                            this.router.navigateByUrl(
                                'administrator-main-page'
                            );
                            this.userService.InitUsers();
                            this.userService.InitMechanics();
                        }
                        this.toastService.success(
                            'You logged in successfully!'
                        );
                    },
                    error: error => {
                        this.toastService.error(error.error);
                    },
                })
        );
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
