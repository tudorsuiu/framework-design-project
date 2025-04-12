import { Component, Input } from '@angular/core';
import { ToastService } from '../../services/toast-service/toast.service';
import { Reparation } from '../../models/entities/Reparation';
import { Subscription } from 'rxjs';
import { User } from '../../models/entities/User';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';
import { REPARATION_TYPES } from '../../constants/reparation-types';
import { UserService } from '../../services/user-service/user.service';
import { ReparationService } from '../../services/reparation-service/reparation.service';

@Component({
    selector: 'app-edit-reparation-modal',
    templateUrl: './edit-reparation-modal.component.html',
    styleUrl: './edit-reparation-modal.component.scss',
})
export class EditReparationModalComponent {
    private subscription: Subscription = new Subscription();
    @Input() reparation!: Reparation;

    loggedUser!: User | null;

    reparationTypes = REPARATION_TYPES;
    minDate: string;

    constructor(
        private authenticationService: AuthenticationService,
        private toastService: ToastService,
        public userService: UserService,
        private reparationService: ReparationService
    ) {
        const today = new Date();
        const day = today.getDate();
        const month = today.getMonth() + 1; // January is 0
        const year = today.getFullYear();

        this.minDate = `${year}-${month < 10 ? '0' + month : month}-${
            day < 10 ? '0' + day : day
        }`;
    }

    ngOnInit() {
        this.subscription.add(
            this.authenticationService.loggedUser$.subscribe(
                user => (this.loggedUser = user)
            )
        );
    }

    onEditReparation() {
        this.subscription.add(
            this.reparationService.putReparation(this.reparation).subscribe(
                () => {
                    const index = this.loggedUser?.reparations?.findIndex(
                        reparation => reparation.id === this.reparation.id
                    );

                    if (index !== undefined && index !== -1) {
                        this.loggedUser?.reparations?.splice(
                            index,
                            1,
                            this.reparation
                        );
                    }

                    this.toastService.success(
                        'Reparation edited successfully!'
                    );
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
