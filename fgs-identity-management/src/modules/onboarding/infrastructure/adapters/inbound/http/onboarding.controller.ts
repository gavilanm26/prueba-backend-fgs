import { Body, Controller, Post } from '@nestjs/common';
import { CreateOnboardingUseCase } from '../../../../application/use-cases/create-onboarding.usecase';
import { CreateOnboardingHttpDto } from './dto/create-onboarding.http.dto';
import { CreateOnboardingOutputDto } from '../../../../application/dto/create-onboarding.dto';

@Controller('v1')
export class OnboardingController {
    constructor(private readonly createOnboardingUseCase: CreateOnboardingUseCase) { }

    @Post('onboarding-client')
    async create(@Body() dto: CreateOnboardingHttpDto): Promise<CreateOnboardingOutputDto> {
        return this.createOnboardingUseCase.execute(dto);
    }
}
