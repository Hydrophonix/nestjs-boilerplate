// Core
import { randomBytes }                 from "crypto";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document }                    from "mongoose";
import { Factory }                     from "nestjs-seeder";

// Instruments
import { Role } from "../../core/auth/role.enum";

@Schema()
export class User extends Document {
    @Factory((faker) => faker.internet.userName())
    @Prop({
        required: true,
    })
    username: string;

    @Factory(() => randomBytes(16).toString("hex"))
    @Prop({
        required: true,
    })
    password: string;

    @Factory((faker) => faker.internet.email())
    @Prop({
        required: true,
        unique:   true,
    })
    email: string;

    @Factory(Role.User)
    @Prop({
        required: true,
        default:  Role.User,
        enum:     Role,
        type:     () => Role,
    })
    role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);
