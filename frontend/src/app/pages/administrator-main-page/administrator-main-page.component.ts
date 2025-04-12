import { Component } from '@angular/core';
import { User } from '../../models/entities/User';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';
import { ReparationService } from '../../services/reparation-service/reparation.service';
import { CarService } from '../../services/car-service/car.service';
import { UserService } from '../../services/user-service/user.service';
import { ToastService } from '../../services/toast-service/toast.service';
import { BillService } from '../../services/bill-service/bill.service';
import { Subscription } from 'rxjs';
import { error } from 'console';
import { Bill } from '../../models/entities/Bill';

@Component({
    selector: 'app-administrator-main-page',
    templateUrl: './administrator-main-page.component.html',
    styleUrl: './administrator-main-page.component.scss',
})
export class AdministratorMainPageComponent {
    private subscription: Subscription = new Subscription();

    loggedUser!: User | null;

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

    getCarDetailsByReparationId(id: any) {
        const reparation = this.loggedUser?.reparations?.find(
            reparation => reparation.id == id
        );

        const car = this.loggedUser?.cars?.find(
            car => car.id == reparation?.carId
        );

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

    getMechanicContactByReparationId(id: any) {
        const reparation = this.loggedUser?.reparations?.find(
            reparation => reparation.id == id
        );

        const mechanic = this.userService.users.find(
            user => user.id == reparation?.mechanicId
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

    billsSortedByDate(): Bill[] {
        if (!this.loggedUser || !this.loggedUser.bills) {
            return [];
        }

        return this.loggedUser.bills.sort((a: Bill, b: Bill) => {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
