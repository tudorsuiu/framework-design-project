import { Injectable } from '@angular/core';
import { Reparation } from '../../models/entities/Reparation';
import { environment } from '../../../environments/environment';
import { Endpoints } from '../../enums/endpoints';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ReparationService {
    constructor(private http: HttpClient) {}

    getReparationsByMechanicId(id: any): Observable<Reparation[]> {
        return this.http.get<any>(
            environment.apiUrl + Endpoints.GET_MECHANIC_REPARATIONS + '/' + id
        );
    }

    getReparations(): Observable<Reparation[]> {
        return this.http.get<Reparation[]>(
            environment.apiUrl + Endpoints.GET_REPARATION
        );
    }

    createReparation(reparation: any): Observable<Reparation> {
        return this.http.post<any>(
            environment.apiUrl + Endpoints.POST_REPARATION,
            reparation
        );
    }

    putReparation(updatedReparation: Reparation): Observable<any> {
        return this.http.put(
            environment.apiUrl +
                Endpoints.PUT_REPARATION +
                '/' +
                updatedReparation.id,
            updatedReparation
        );
    }

    deleteReparation(id: any): Observable<any> {
        return this.http.delete<any>(
            environment.apiUrl + Endpoints.DELETE_REPARATION + '/' + id
        );
    }
}
