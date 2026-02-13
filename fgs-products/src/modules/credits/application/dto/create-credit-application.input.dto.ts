export class CreateCreditApplicationInputDto {
    constructor(
        public readonly customerId: string,
        public readonly purpose: string,
        public readonly amount: number,
        public readonly term: number,
    ) { }
}
