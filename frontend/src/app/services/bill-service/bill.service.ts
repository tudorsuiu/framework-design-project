import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Endpoints } from '../../enums/endpoints';
import { Bill } from '../../models/entities/Bill';

@Injectable({
    providedIn: 'root',
})
export class BillService {
    constructor(private http: HttpClient) {}

    getBills(): Observable<Bill[]> {
        return this.http.get<Bill[]>(environment.apiUrl + Endpoints.GET_BILL);
    }

    createBill(bill: any): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + Endpoints.POST_BILL,
            bill
        );
    }
}
