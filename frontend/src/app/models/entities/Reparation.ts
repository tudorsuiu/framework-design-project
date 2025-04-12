import { Bill } from './Bill';
import { Car } from './Car';
import { User } from './User';

export class Reparation {
    id: number = 0;
    userId: number = 0;
    mechanicId: number = 0;
    carId: number = 0;
    type: string = '';
    description: string = '';
    date: Date = new Date();
    status: string = '';
}
