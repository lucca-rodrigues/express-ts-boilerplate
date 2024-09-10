module.exports = function (plop) {
  const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const camelCase = (string) => {
    return string
      .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
        index === 0 ? match.toLowerCase() : match.toUpperCase()
      )
      .replace(/\s+/g, "");
  };

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
      // {
      //   type: "shell",
      //   command:
      //     "npm run typeorm migration:create -d src/infra/database/migrations {{lowerCase moduleName}}",
      // },
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
        template:
          `import { ${capitalize(
            "{{pascalCase moduleName}}"
          )} } from "modules/{{lowerCase moduleName}}/entity/{{camelCase moduleName}}.entity";\n` +
          `export const ${camelCase(
            "{{moduleName}}"
          )}Repository = AppDataSource.getRepository(${capitalize(
            "{{pascalCase moduleName}}"
          )});\n`,
      },
    ],
  });
};
