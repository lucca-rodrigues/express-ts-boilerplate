import { Router } from "express";
import { validator } from "infra";

import SampleService from "modules/sample/sample.service";
import SampleUseCases from "modules/sample/sample.useCases"; 
import { SampleDto } from "modules/sample/dto/sample.dto";

const controller = Router();
const sampleUseCases = new SampleUseCases(); 
const sampleService = new SampleService(sampleUseCases);

controller.get("/", (req, res) => sampleService.getAll(req, res));
controller.get("/:id", (req, res) => sampleService.getOne(req, res));
controller.post("/", validator(SampleDto), (req, res) => sampleService.create(req, res));
controller.put("/:id", validator(SampleDto), (req, res) => sampleService.update(req, res));
controller.delete("/:id", (req, res) => sampleService.delete(req, res));

export default controller;