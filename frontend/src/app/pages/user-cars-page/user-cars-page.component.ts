import { Component, ElementRef, Input, ViewChild, model } from '@angular/core';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';
import { CAR_BRANDS } from '../../constants/car-brands';
import { CAR_MODELS } from '../../constants/car-models';
import { Subscription } from 'rxjs';
import { ToastService } from '../../services/toast-service/toast.service';
import { UserService } from '../../services/user-service/user.service';
import { User } from '../../models/entities/User';
import { CarService } from '../../services/car-service/car.service';
import { Car } from '../../models/entities/Car';

@Component({
    selector: 'app-user-cars-page',
    templateUrl: './user-cars-page.component.html',
    styleUrl: './user-cars-page.component.scss',
})
export class UserCarsPageComponent {
    private subscription: Subscription = new Subscription();

    loggedUser!: User | null;

    userIdValue!: number | undefined;
    carBrandValue: string | null = null;
    carModelValue: string | null = null;
    carFabricationYearValue!: number;
    carLicensePlateValue!: string;

    carToBeEdited: Car = new Car();
    carToBeDeleted: Car = new Car();

    models = CAR_MODELS;
    brands = CAR_BRANDS;

    constructor(
        public authenticationService: AuthenticationService,
        private toastService: ToastService,
        private userService: UserService,
        private carService: CarService
    ) {}

    ngOnInit() {
        this.subscription.add(
            this.authenticationService.loggedUser$.subscribe(
                user => (this.loggedUser = user)
            )
        );

        this.userIdValue = this.loggedUser?.id;
    }

    onCreateCar() {
        if (
            this.loggedUser !== undefined &&
            this.loggedUser?.id !== undefined
        ) {
            this.subscription.add(
                this.carService
                    .createCar({
                        userId: this.userIdValue,
                        brand: this.carBrandValue,
                        model: this.carModelValue,
                        fabricationYear: this.carFabricationYearValue,
                        licensePlate: this.carLicensePlateValue,
                    })
                    .subscribe({
                        next: data => {
                            this.loggedUser?.cars?.push(data);
                            this.toastService.success(
                                'Car was created with success!'
                            );
                        },
                        error: error => {
                            this.toastService.error(
                                'An error occurred while creating the car!'
                            );
                        },
                    })
            );
        }
    }

    onDeleteCar(id: any) {
        this.subscription.add(
            this.carService.deleteCar(id).subscribe(
                () => {
                    const index = this.loggedUser?.cars?.findIndex(
                        car => car.id === id
                    );
                    if (index !== undefined && index !== -1) {
                        this.deleteReparationsByCarId(id);
                        this.loggedUser?.cars?.splice(index, 1);
                        this.toastService.success('Car deleted successfully!');
                    }
                },
                error => {
                    this.toastService.error(
                        'An error occurred while deleting the car!'
                    );
                }
            )
        );
    }

    onDeleteCarConfirmed() {
        this.onDeleteCar(this.carToBeDeleted.id);
    }

    deleteReparationsByCarId(id: any) {
        const filteredReparations = this.loggedUser?.reparations?.filter(
            reparation => reparation.carId === id
        );

        if (filteredReparations) {
            filteredReparations.forEach(filteredReparation => {
                const reparationIndex =
                    this.loggedUser?.reparations?.indexOf(filteredReparation);
                if (reparationIndex !== undefined && reparationIndex !== -1) {
                    this.loggedUser?.reparations?.splice(reparationIndex, 1);
                    this.deleteBillsByReparationId(filteredReparation.id);
                }
            });
        }
    }

    deleteBillsByReparationId(id: any) {
        const filteredBills = this.loggedUser?.bills?.filter(
            bill => bill.reparationId === id
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

    selectCarToBeEdited(car: Car) {
        this.carToBeEdited = car;
    }

    selectCarToBeDeleted(car: Car) {
        this.carToBeDeleted = car;
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
