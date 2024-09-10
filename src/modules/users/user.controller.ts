import { Router } from "express";
import { validator } from "infra";
import UserServices from "modules/users/user.service";
import UserUseCases from "modules/users/user.useCases";
import { UserDto } from "modules/users/dto/user.dto";

const controller = Router();
const userUseCases = new UserUseCases();
const userServices = new UserServices(userUseCases);

controller.get("/users", (req, res) => userServices.getAll(req, res));
controller.get("/users/:id", (req, res) => userServices.getOne(req, res));
controller.post("/users", validator(UserDto), (req, res) =>
  userServices.create(req, res)
);
controller.put("/users/:id", validator(UserDto), (req, res) =>
  userServices.update(req, res)
);
controller.delete("/users/:id", (req, res) => userServices.delete(req, res));

export default controller;
