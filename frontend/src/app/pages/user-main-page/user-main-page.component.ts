import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';
import { REPARATION_TYPES } from '../../constants/reparation-types';
import { User } from '../../models/entities/User';
import { UserService } from '../../services/user-service/user.service';
import { Subscription } from 'rxjs';
import { Reparation } from '../../models/entities/Reparation';
import { ReparationService } from '../../services/reparation-service/reparation.service';
import { ToastService } from '../../services/toast-service/toast.service';
import { Car } from '../../models/entities/Car';
import { TOKEN_CONSTANT } from '../../constants/token';

@Component({
    selector: 'app-user-main-page',
    templateUrl: './user-main-page.component.html',
    styleUrl: './user-main-page.component.scss',
})
export class UserMainPageComponent {
    private subscription: Subscription = new Subscription();

    reparationTypes = REPARATION_TYPES;

    cars: Car[] = [];

    loggedUser!: User | null;

    userIdFormValue!: number | undefined;
    carIdFormValue: number | null = null;
    mechanicIdValue: number | null = null;
    reparationTypeValue: string | null = null;
    dateValue!: Date;
    minDate: string;
    descriptionValue: string | null = null;

    reparationToBeEdited: Reparation = new Reparation();
    reparationToBeDeleted: Reparation = new Reparation();

    constructor(
        public authenticationService: AuthenticationService,
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
            this.authenticationService.loggedUser$.subscribe(user => {
                this.loggedUser = user;
            })
        );

        this.userIdFormValue = this.loggedUser?.id;
    }

    onCreateAppointment() {
        if (
            this.loggedUser !== undefined &&
            this.loggedUser?.id !== undefined
        ) {
            this.subscription.add(
                this.reparationService
                    .createReparation({
                        userId: this.userIdFormValue,
                        mechanicId: this.mechanicIdValue,
                        carId: this.carIdFormValue,
                        type: this.reparationTypeValue,
                        description: this.descriptionValue,
                        date: this.dateValue,
                        status: 'New',
                    })
                    .subscribe({
                        next: data => {
                            this.loggedUser?.reparations?.push(data);
                            this.toastService.success(
                                'Appointment was created with success!'
                            );
                        },
                        error: error => {
                            this.toastService.error(
                                'An error occurred while creating the appointment.'
                            );
                        },
                    })
            );
        }
    }

    onDeleteAppointment(id: any) {
        this.subscription.add(
            this.reparationService.deleteReparation(id).subscribe(
                () => {
                    const index = this.loggedUser?.reparations?.findIndex(
                        reparation => reparation.id === id
                    );
                    if (index !== undefined && index !== -1) {
                        this.loggedUser?.reparations?.splice(index, 1);
                        this.deleteBillsByReparationId(id);
                        this.toastService.success(
                            'Appointment deleted successfully!'
                        );
                    }
                },
                error =>
                    this.toastService.error(
                        'An error occurred while deleting the appointment!'
                    )
            )
        );
    }

    onDeleteReparationConfirmed() {
        this.onDeleteAppointment(this.reparationToBeDeleted.id);
    }

    getMechanicContactById(id: any) {
        const mechanic = this.userService.mechanics.find(
            mechanic => mechanic.id == id
        );

        if (
            mechanic?.firstName !== undefined &&
            mechanic?.lastName !== undefined
        ) {
            return (
                mechanic?.firstName +
                ' ' +
                mechanic?.lastName +
                ' - ' +
                mechanic?.phoneNumber
            );
        } else {
            return 'Mechanic not found!';
        }
    }

    getCarDetailsById(id: any) {
        const car = this.loggedUser?.cars?.find(car => car.id == id);

        return car?.brand + ' ' + car?.model + ' - ' + car?.licensePlate;
    }

    deleteBillsByReparationId(id: any) {
        const filteredBills = this.loggedUser?.bills?.filter(
            bill => bill.id === id
        );

        if (filteredBills) {
            filteredBills.forEach(filteredBill => {
                const billIndex = this.loggedUser?.bills?.indexOf(filteredBill);

                if (billIndex !== undefined && billIndex !== -1) {
                    this.loggedUser?.bills?.splice(billIndex, 1);
                }
            });
        }
    }

    selectReparationToBeEdited(reparation: Reparation) {
        this.reparationToBeEdited = reparation;
    }

    selectReparationToBeDeleted(reparation: Reparation) {
        this.reparationToBeDeleted = reparation;
    }

    reparationsByStatusAndDate(): Reparation[] {
        const reparations = this.loggedUser?.reparations;

        if (reparations !== undefined) {
            const doneReparations = reparations
                .filter(r => r.status === 'Done')
                .sort(
                    (a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                );

            const notDoneReparations = reparations
                .filter(r => r.status !== 'Done')
                .sort(
                    (a, b) =>
                        new Date(a.date).getTime() - new Date(b.date).getTime()
                );

            return notDoneReparations.concat(doneReparations);
        } else {
            return [];
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
