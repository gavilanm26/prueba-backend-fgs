export enum OnboardingStatus {
    REQUESTED = 'REQUESTED',
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    REJECTED = 'REJECTED',
}

export class Onboarding {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly username: string,
        public readonly document: string,
        public readonly email: string,
        public readonly amount: number,
        public readonly password: string,
        public readonly status: OnboardingStatus,
        public readonly createdAt: Date = new Date(),
    ) { }
}
