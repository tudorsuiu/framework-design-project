import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, ReplaySubject, map, of, tap } from 'rxjs';
import { Endpoints } from '../../enums/endpoints';
import { environment } from '../../../environments/environment';
import { User } from '../../models/entities/User';
import { TOKEN_CONSTANT } from '../../constants/token';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {
    private currentUserSource = new ReplaySubject<User | null>(1);
    loggedUser$ = this.currentUserSource.asObservable();

    constructor(private http: HttpClient, private router: Router) {}

    register(registerUserDetails: any): Observable<any> {
        return this.http.post(
            environment.apiUrl + Endpoints.REGISTER,
            registerUserDetails
        );
    }

    login(loginUserDetails: any): Observable<any> {
        return this.http
            .post<User>(environment.apiUrl + Endpoints.LOGIN, loginUserDetails)
            .pipe(
                map((response: any) => {
                    if (response) {
                        sessionStorage.setItem(TOKEN_CONSTANT, response.token);
                        this.currentUserSource.next(response.user);
                        return response.user;
                    }
                })
            );
    }

    getLoggedInUser(token: string | null): Observable<any> {
        if (!token) {
            this.currentUserSource.next(null);
            return of(null);
        }

        let headers = new HttpHeaders();
        headers = headers.set('Authorization', `Bearer ${token}`);

        return this.http
            .get<User>(environment.apiUrl + Endpoints.GET_LOGGED_USER, {
                headers,
            })
            .pipe(
                map((response: any) => {
                    sessionStorage.setItem(TOKEN_CONSTANT, response.token);
                    this.currentUserSource.next(response.user);
                })
            );
    }

    logout() {
        this.currentUserSource.next(null);
        sessionStorage.removeItem(TOKEN_CONSTANT);
    }
}
