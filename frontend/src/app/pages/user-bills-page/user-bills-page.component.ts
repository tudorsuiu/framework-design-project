import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';
import { Subscription } from 'rxjs';
import { User } from '../../models/entities/User';
import { Bill } from '../../models/entities/Bill';

@Component({
    selector: 'app-user-bills-page',
    templateUrl: './user-bills-page.component.html',
    styleUrl: './user-bills-page.component.scss',
})
export class UserBillsPageComponent {
    private subscription: Subscription = new Subscription();

    constructor(public authenticationService: AuthenticationService) {}

    loggedUser!: User | null;

    userIdValue!: number | undefined;

    ngOnInit() {
        this.subscription.add(
            this.authenticationService.loggedUser$.subscribe(
                user => (this.loggedUser = user)
            )
        );

        this.userIdValue = this.loggedUser?.id;
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
