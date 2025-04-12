import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Car } from '../../models/entities/Car';
import { environment } from '../../../environments/environment';
import { Endpoints } from '../../enums/endpoints';
import { User } from '../../models/entities/User';
import { UserService } from '../user-service/user.service';

@Injectable({
    providedIn: 'root',
})
export class CarService {
    constructor(private http: HttpClient) {}

    getCars(): Observable<Car[]> {
        return this.http.get<any>(environment.apiUrl + Endpoints.GET_CARS);
    }

    createCar(car: any): Observable<Car> {
        return this.http.post<any>(
            environment.apiUrl + Endpoints.POST_CAR,
            car
        );
    }

    putCar(updatedCar: any): Observable<any> {
        return this.http.put(
            environment.apiUrl + Endpoints.PUT_CAR + '/' + updatedCar.id,
            updatedCar
        );
    }

    deleteCar(id: any): Observable<any> {
        return this.http.delete<any>(
            environment.apiUrl + Endpoints.DELETE_CAR + '/' + id
        );
    }
}
