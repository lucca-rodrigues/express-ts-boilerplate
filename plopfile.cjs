module.exports = function (plop) {
  plop.setGenerator("module", {
    description: "Criar um novo módulo",
    prompts: [
      {
        type: "input",
        name: "moduleName",
        message: "Qual o nome do módulo?",
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/modules/{{lowerCase moduleName}}/entity/{{camelCase moduleName}}.entity.ts",
        templateFile: "src/infra/templates/entity/index.hbs",
      },
      {
        type: "add",
        path: "src/modules/{{lowerCase moduleName}}/dto/{{camelCase moduleName}}.dto.ts",
        templateFile: "src/infra/templates/dto/index.hbs",
      },
      {
        type: "append",
        path: "src/infra/repository/index.ts",
        templateFile: "src/infra/templates/repository/index.hbs",
      },
      {
        type: "add",
        path: "src/modules/{{camelCase moduleName}}/{{camelCase moduleName}}.useCases.ts",
        templateFile: "src/infra/templates/useCases/index.hbs",
      },
      {
        type: "add",
        path: "src/modules/{{camelCase moduleName}}/{{camelCase moduleName}}.controller.ts",
        templateFile: "src/infra/templates/controller/index.hbs",
      },
      {
        type: "add",
        path: "src/modules/{{camelCase moduleName}}/{{camelCase moduleName}}.service.ts",
        templateFile: "src/infra/templates/service/index.hbs",
      },
    ],
  });
};
