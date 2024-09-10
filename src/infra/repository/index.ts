import { AppDataSource } from "data-source";
import { User } from "modules/users/entity/user.entity";

export const userRepository = AppDataSource.getRepository(User);
