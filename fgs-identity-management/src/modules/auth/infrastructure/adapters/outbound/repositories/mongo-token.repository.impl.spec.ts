import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { MongoTokenRepository } from './mongo-token.repository.impl';
import { User } from '../../../persistence/schemas/user.schema';

describe('MongoTokenRepository', () => {
    let repository: MongoTokenRepository;
    let mockUserModel: any;

    beforeEach(async () => {
        mockUserModel = {
            findOne: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MongoTokenRepository,
                {
                    provide: getModelToken(User.name),
                    useValue: mockUserModel,
                },
            ],
        }).compile();

        repository = module.get<MongoTokenRepository>(MongoTokenRepository);
    });

    it('should be defined', () => {
        expect(repository).toBeDefined();
    });

    describe('validateUser', () => {
        it('should return userId for valid credentials', async () => {
            const mockUser = {
                _id: '507f1f77bcf86cd799439011',
                username: 'admin',
                password: '1234',
            };

            mockUserModel.findOne.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockUser),
            });

            const result = await repository.validateUser('admin', '1234');
            expect(result).toEqual({ userId: '507f1f77bcf86cd799439011' });
        });

        it('should return null if user is not found', async () => {
            mockUserModel.findOne.mockReturnValue({
                exec: jest.fn().mockResolvedValue(null),
            });

            const result = await repository.validateUser('user', 'wrong');
            expect(result).toBeNull();
        });
    });
});
