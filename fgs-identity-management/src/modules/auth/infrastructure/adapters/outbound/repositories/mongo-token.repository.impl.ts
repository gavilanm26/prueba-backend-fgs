import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TokenRepositoryPort } from '../../../../domain/ports/token-repository.port';
import { User, UserDocument } from '../../../persistence/schemas/user.schema';

@Injectable()
export class MongoTokenRepository implements TokenRepositoryPort {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) { }

  async validateUser(username: string, password: string) {
    const user = await this.userModel.findOne({ username, password }).exec();

    if (user) {
      return { userId: user._id.toString() };
    }
    return null;
  }
}