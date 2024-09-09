import { AppDataSource } from "data-source";
import { User } from "modules/users/entity/User.entity";

export const userRepository = AppDataSource.getRepository(User);
