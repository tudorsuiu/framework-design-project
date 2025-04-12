import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';
import { Roles } from '../../enums/roles';
import { Subscription } from 'rxjs';
import { User } from '../../models/entities/User';
import { UserService } from '../../services/user-service/user.service';
import { error } from 'console';
import { ToastService } from '../../services/toast-service/toast.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-user-edit-page',
    templateUrl: './user-edit-page.component.html',
    styleUrl: './user-edit-page.component.scss',
})
export class UserEditPageComponent {
    private subscription: Subscription = new Subscription();

    loggedUser!: User | null;
    editedUser = {
        id: 0,
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        role: Roles.USER,
    };

    constructor(
        public authenticationService: AuthenticationService,
        private userService: UserService,
        private toastService: ToastService,
        private router: Router
    ) {}

    ngOnInit() {
        this.subscription.add(
            this.authenticationService.loggedUser$.subscribe(
                user => (this.loggedUser = user)
            )
        );

        if (this.loggedUser !== undefined && this.loggedUser !== null) {
            this.editedUser.id = this.loggedUser.id;
            this.editedUser.firstName = this.loggedUser.firstName;
            this.editedUser.lastName = this.loggedUser.lastName;
            this.editedUser.email = this.loggedUser.email;
            this.editedUser.phoneNumber = this.loggedUser.phoneNumber;
            this.editedUser.password = '';
            this.editedUser.role = Roles.USER;
        }
    }

    onEditProfile() {
        this.subscription.add(
            this.userService.putUser(this.editedUser).subscribe(
                () => {
                    if (this.loggedUser) {
                        this.loggedUser.firstName = this.editedUser.firstName;
                        this.loggedUser.lastName = this.editedUser.lastName;
                        this.loggedUser.phoneNumber =
                            this.editedUser.phoneNumber;
                        this.loggedUser.email = this.editedUser.email;

                        this.toastService.success(
                            'Profile edited successfully!'
                        );
                    }
                },
                error => {
                    this.toastService.error(error.error);
                }
            )
        );
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
