import { Component, Input } from '@angular/core';
import { CAR_MODELS } from '../../constants/car-models';
import { CAR_BRANDS } from '../../constants/car-brands';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';
import { CarService } from '../../services/car-service/car.service';
import { Car } from '../../models/entities/Car';
import { Subscription } from 'rxjs';
import { User } from '../../models/entities/User';
import { ToastService } from '../../services/toast-service/toast.service';

@Component({
    selector: 'app-edit-car-modal',
    templateUrl: './edit-car-modal.component.html',
    styleUrl: './edit-car-modal.component.scss',
})
export class EditCarModalComponent {
    private subscription: Subscription = new Subscription();
    @Input() car!: Car;

    loggedUser!: User | null;

    models = CAR_MODELS;
    brands = CAR_BRANDS;

    userIdModalValue!: number | undefined;

    constructor(
        private authenticationService: AuthenticationService,
        private toastService: ToastService,
        private carService: CarService
    ) {}

    ngOnInit() {
        this.subscription.add(
            this.authenticationService.loggedUser$.subscribe(
                user => (this.loggedUser = user)
            )
        );
    }

    onEditCar() {
        this.subscription.add(
            this.carService.putCar(this.car).subscribe(
                () => {
                    const index = this.loggedUser?.cars?.findIndex(
                        car => car.id === this.car.id
                    );

                    if (index !== undefined && index !== -1) {
                        this.loggedUser?.cars?.splice(index, 1, this.car);
                    }

                    this.toastService.success('Car edited successfully!');
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
