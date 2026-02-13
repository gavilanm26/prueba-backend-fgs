export class CreateOnboardingInputDto {
    name: string;
    username: string;
    document: number;
    email: string;
    amount: number;
    password: string;
}

export class CreateOnboardingOutputDto {
    onboardingId: string;
    status: string;
}
