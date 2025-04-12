import { Component } from '@angular/core';
import { Roles } from '../../enums/roles';
import { ToastService } from '../../services/toast-service/toast.service';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { UserService } from '../../services/user-service/user.service';

@Component({
    selector: 'app-administrator-add-mechanic-page',
    templateUrl: './administrator-add-mechanic-page.component.html',
    styleUrl: './administrator-add-mechanic-page.component.scss',
})
export class AdministratorAddMechanicPageComponent {
    private subscription: Subscription = new Subscription();

    mechanic = {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        role: Roles.MECHANIC,
    };

    constructor(
        private toastService: ToastService,
        public authenticationService: AuthenticationService,
        private userService: UserService
    ) {}

    onAddMechanic(form: NgForm) {
        this.subscription.add(
            this.authenticationService.register(this.mechanic).subscribe({
                next: () => {
                    form.resetForm();
                    this.toastService.success('Mechanic created successfully!');
                },
                error: error => {
                    this.toastService.error(error.error);
                },
            })
        );

        this.userService.InitMechanics();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
