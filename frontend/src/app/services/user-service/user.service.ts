import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subscription, take } from 'rxjs';
import { User } from '../../models/entities/User';
import { environment } from '../../../environments/environment';
import { Endpoints } from '../../enums/endpoints';
import { MECHANICS_KEY, USERS_KEY } from '../../constants/cookie-keys';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private subscription: Subscription = new Subscription();

    mechanics: User[] = [];
    users: User[] = [];

    constructor(private http: HttpClient) {}

    ngOnInit() {}

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(environment.apiUrl + Endpoints.GET_USERS);
    }

    getMechanics(): Observable<User[]> {
        return this.http.get<User[]>(environment.apiUrl + Endpoints.MECHANICS);
    }

    putUser(updatedUser: any): Observable<any> {
        return this.http.put(
            environment.apiUrl + Endpoints.PUT_USER + '/' + updatedUser.id,
            updatedUser
        );
    }

    InitMechanics() {
        this.subscription.add(
            this.getMechanics().subscribe({
                next: data => {
                    this.mechanics = data;
                    sessionStorage.setItem(MECHANICS_KEY, JSON.stringify(data));
                },
                error: error => console.log(error.error),
            })
        );
    }

    InitUsers() {
        this.subscription.add(
            this.getUsers().subscribe({
                next: data => {
                    this.users = data;
                    sessionStorage.setItem(USERS_KEY, JSON.stringify(data));
                },
                error: error => console.log(error.error),
            })
        );
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
