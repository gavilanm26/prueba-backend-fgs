import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { CreateCreditApplicationUseCase } from '../../../../application/use-cases/create-credit-application.usecase';
import { GetCreditApplicationsUseCase } from '../../../../application/use-cases/get-credit-applications.usecase';
import { GetCreditApplicationByCustomerIdUseCase } from '../../../../application/use-cases/get-credit-application-by-id.usecase';
import { CreateCreditApplicationHttpDto } from './dto/create-credit-application.http.dto';
import { CreateCreditApplicationInputDto } from '../../../../application/dto/create-credit-application.input.dto';
import { CreateCreditApplicationOutputDto } from '../../../../application/dto/create-credit-application.output.dto';
import { CreditApplicationOutputDto } from '../../../../application/dto/credit-application.output.dto';

@Controller('credits')
export class CreditsController {
    constructor(
        private readonly createUseCase: CreateCreditApplicationUseCase,
        private readonly getAllUseCase: GetCreditApplicationsUseCase,
        private readonly getByCustomerIdUseCase: GetCreditApplicationByCustomerIdUseCase,
    ) { }

    @Post()
    async create(@Body() body: CreateCreditApplicationHttpDto): Promise<CreateCreditApplicationOutputDto> {
        const input = new CreateCreditApplicationInputDto(
            body.customerId,
            body.purpose,
            body.amount,
            body.term,
        );
        return this.createUseCase.execute(input);
    }

    @Get()
    async findAll(): Promise<CreditApplicationOutputDto[]> {
        return this.getAllUseCase.execute();
    }

    @Get(':customerId')
    async findByCustomerId(@Param('customerId') customerId: string): Promise<CreditApplicationOutputDto> {
        return this.getByCustomerIdUseCase.execute(customerId);
    }
}
