import express from "express";
const router = express.Router();
export default router;

import { getEmployees, getEmployeeById, addEmployee } from "#db/employees";

function isValidName(name) {
  return typeof name === "string" && name.trim().length > 0;
}

router.route("/").get((req, res) => {
  res.send("Hello employees!");
});

router
  .route("/employees")
  .get((req, res) => {
    const employees = getEmployees();
    res.send(employees);
  })
  .post((req, res) => {
    if (!req.body || typeof req.body !== "object") {
      return res.status(400).send("Request body must be provided.");
    }

    const { name } = req.body;

    if (name === undefined) {
      return res.status(400).send("Name is required.");
    }

    if (!isValidName(name)) {
      return res.status(400).send("Name must be a non-empty string.");
    }

    const employee = addEmployee(name.trim());
    res.status(201).send(employee);
  });

router.route("/employees/random").get((req, res) => {
  const employees = getEmployees();
  const randomIndex = Math.floor(Math.random() * employees.length);
  res.send(employees[randomIndex]);
});

router.route("/employees/:id").get((req, res) => {
  const { id } = req.params;
  const employee = getEmployeeById(+id);

  if (!employee) {
    return res.status(404).send("Employee not found");
  }

  res.send(employee);
});
