// Core
import { Injectable }   from "@nestjs/common";
import { InjectModel }  from "@nestjs/mongoose";
import { Model }        from "mongoose";
import { DeleteResult } from "mongoose/node_modules/mongodb";

// Instruments
import { CreateUserDto, UpdateUserDto }     from "../dto";
import { FindManyUsers, FindUsersResponse } from "../types";
import { User }                             from "../user.schema";

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>,
    ) {}


    create(createUserDto: CreateUserDto): Promise<User> {
        return this.userModel.create(createUserDto);
    }


    getAllUsers(): Promise<User[]> {
        return this.userModel.find().exec();
    }


    findOneById(id: string): Promise<User> {
        return this.userModel.findById(id).exec();
    }


    findOneByEmail(email: string): Promise<User> {
        return this.userModel.findOne({ email }).exec();
    }


    async findMany({ sort, order, skip, limit }: FindManyUsers): Promise<FindUsersResponse> {
        const results = await this.userModel
            .find()
            .sort({ [ sort ]: order })
            .skip(skip)
            .limit(limit)
            .exec();

        const count = await this.userModel
            .find()
            .countDocuments()
            .exec();

        return { results, count };
    }


    updateOneById(id: string, data: UpdateUserDto): Promise<User> {
        return this.userModel.findByIdAndUpdate(
            id,
            { ...data },
            { new: true },
        ).exec();
    }


    deleteOneById(id: string): Promise<DeleteResult> {
        return this.userModel.deleteOne({ _id: id }).exec();
    }
}
