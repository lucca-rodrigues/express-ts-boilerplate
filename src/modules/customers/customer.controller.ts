import { Router } from "express";
import { validator } from "infra";
import CustomerServices from "modules/customers/customer.service";
import { CreateCustomerDto } from "modules/customers/dto/createCustomer.dto";
import CustomerUseCases from "modules/customers/customer.useCases";

const controller = Router();
const customerUseCases = new CustomerUseCases();
const customerServices = new CustomerServices(customerUseCases);

// Subscriptions
controller.get("/customers", (req, res) => customerServices.getAll(req, res));
controller.get("/customers/:id", (req, res) => customerServices.getOne(req, res));
controller.post("/customers", validator(CreateCustomerDto), (req, res) => customerServices.create(req, res));
controller.put("/customers/:id", validator(CreateCustomerDto), (req, res) => customerServices.update(req, res));
controller.delete("/customers/:id", (req, res) => customerServices.delete(req, res));

export default controller;
