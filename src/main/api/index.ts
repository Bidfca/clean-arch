import "../config/module-alias";

// js do not recognize @ as a path alias, so we need to install module-alias
import { PersonController } from "@/application/controllers";

const personController = new PersonController();
console.log(personController.getPerson());
