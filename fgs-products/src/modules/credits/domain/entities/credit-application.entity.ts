export class CreditApplication {
    constructor(
        public readonly id: string,
        public readonly customerId: string,
        public readonly purpose: string,
        public readonly amount: number,
        public readonly term: number,
        public readonly status: string = 'PENDING',
    ) { }
}
