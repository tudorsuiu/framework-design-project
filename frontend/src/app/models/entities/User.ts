import { Bill } from './Bill';
import { Car } from './Car';
import { Reparation } from './Reparation';

export class User {
    id: number = 0;
    firstName: string = '';
    lastName: string = '';
    email: string = '';
    phoneNumber: string = '';
    password: string = '';
    role: string = '';

    cars?: Car[];
    reparations?: Reparation[];
    bills?: Bill[];
}
