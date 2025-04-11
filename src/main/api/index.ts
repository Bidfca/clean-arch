// add moduleResolution to be able to import folders directly
// import { PersonController } from "../../application/controllers";

// add "type": "module" to package.json to use ES modules
import { PersonController } from "../../application/controllers/person.js";

const personController = new PersonController();
console.log(personController.getPerson());
