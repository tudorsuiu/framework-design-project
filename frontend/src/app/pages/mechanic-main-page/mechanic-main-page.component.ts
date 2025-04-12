import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';
import { Reparation } from '../../models/entities/Reparation';
import { ReparationService } from '../../services/reparation-service/reparation.service';
import { Subscription } from 'rxjs';
import { User } from '../../models/entities/User';
import { CarService } from '../../services/car-service/car.service';
import { UserService } from '../../services/user-service/user.service';
import { STATUS } from '../../enums/reparation-statuses';
import { error } from 'console';
import { ToastService } from '../../services/toast-service/toast.service';
import { BillService } from '../../services/bill-service/bill.service';

@Component({
    selector: 'app-mechanic-main-page',
    templateUrl: './mechanic-main-page.component.html',
    styleUrl: './mechanic-main-page.component.scss',
})
export class MechanicMainPageComponent {
    private subscription: Subscription = new Subscription();

    loggedUser!: User | null;

    billTotals: { [reparationId: string]: number } = {};

    constructor(
        public authenticationService: AuthenticationService,
        private reparationService: ReparationService,
        private carService: CarService,
        private userService: UserService,
        private toastService: ToastService,
        private billService: BillService
    ) {}

    ngOnInit() {
        this.subscription.add(
            this.authenticationService.loggedUser$.subscribe(
                user => (this.loggedUser = user)
            )
        );
    }

    getCarDetailsById(id: any) {
        const car = this.loggedUser?.cars?.find(car => car.id == id);

        return car?.brand + ' ' + car?.model + ' - ' + car?.licensePlate;
    }

    getUserContactById(id: any) {
        const user = this.userService.users.find(user => user.id == id);

        if (user?.firstName !== undefined && user?.lastName !== undefined) {
            return (
                user?.firstName +
                ' ' +
                user?.lastName +
                ' - ' +
                user?.phoneNumber
            );
        } else {
            return 'User not found!';
        }
    }

    getReparationDescriptionById(id: any) {
        const reparation = this.loggedUser?.reparations?.find(
            reparation => reparation.id == id
        );

        return reparation?.description;
    }

    getReparationTypeById(id: any) {
        const reparation = this.loggedUser?.reparations?.find(
            reparation => reparation.id == id
        );

        return reparation?.type;
    }

    updateReparationStatus(reparation: Reparation) {
        if (reparation.status == STATUS.NEW) {
            reparation.status = STATUS.IN_PROGRESS;
            this.updateReparation(reparation);
        } else if (reparation.status == STATUS.IN_PROGRESS) {
            reparation.status = STATUS.AWAITING_PAYMENT;
            this.updateReparation(reparation);
        } else if (reparation.status == STATUS.AWAITING_PAYMENT) {
            this.subscription.add(
                this.billService
                    .createBill({
                        reparationId: reparation.id,
                        userId: reparation.userId,
                        date: new Date(),
                        total: this.billTotals[reparation.id],
                    })
                    .subscribe(
                        () => {
                            reparation.status = STATUS.DONE;
                            this.updateReparation(reparation);

                            if (
                                this.loggedUser !== null &&
                                this.loggedUser !== undefined
                            ) {
                                this.loggedUser.reparations =
                                    this.loggedUser.reparations?.filter(
                                        rep => rep.id !== reparation.id
                                    );
                            }
                        },
                        error =>
                            this.toastService.error(
                                'An error occurred while creating the bill!'
                            )
                    )
            );
        }
    }

    updateReparation(reparation: any) {
        this.subscription.add(
            this.reparationService.putReparation(reparation).subscribe(
                () =>
                    this.toastService.success(
                        'Reparation status updated successfully!'
                    ),
                error => this.toastService.error(error.error)
            )
        );
    }

    reparationsSortedByDate() {
        if (!this.loggedUser || !this.loggedUser.reparations) {
            return [];
        }

        return this.loggedUser.reparations.sort(
            (a: Reparation, b: Reparation) => {
                return new Date(a.date).getTime() - new Date(b.date).getTime();
            }
        );
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
