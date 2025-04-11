export class PersonController {
  constructor() {
    console.log("PersonController initialized");
  }

  getPerson() {
    return { name: "John Doe", age: 30 };
  }
}
