import { Reparation } from './Reparation';
import { User } from './User';

export class Bill {
    id: number = 0;
    reparationId: number = 0;
    userId: number = 0;
    date: Date = new Date();
    total: number = 0;
}
