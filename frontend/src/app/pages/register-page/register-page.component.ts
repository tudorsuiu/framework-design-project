import { Component } from '@angular/core';
import { ToastService } from '../../services/toast-service/toast.service';
import { Roles } from '../../enums/roles';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';
import { error } from 'console';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service/user.service';

@Component({
    selector: 'app-register-page',
    templateUrl: './register-page.component.html',
    styleUrl: './register-page.component.scss',
})
export class RegisterPageComponent {
    user = {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        role: Roles.USER,
    };

    constructor(
        private toastService: ToastService,
        private authenticationService: AuthenticationService,
        private router: Router,
        private userService: UserService
    ) {}

    onRegister() {
        if (this.user.password !== this.user.confirmPassword) {
            this.toastService.error(
                'Passwords do not match!',
                'Wrong passwords'
            );
        } else {
            this.authenticationService
                .register({
                    firstName: this.user.firstName,
                    lastName: this.user.lastName,
                    email: this.user.email,
                    phoneNumber: this.user.phoneNumber,
                    password: this.user.password,
                    role: Roles.USER,
                })
                .subscribe({
                    next: response => {
                        this.router.navigateByUrl('login');
                        this.toastService.success(
                            'Account created successfully!'
                        );
                    },
                    error: error => {
                        this.toastService.error(error.error);
                    },
                });

            this.userService.InitUsers();
        }
    }
}
