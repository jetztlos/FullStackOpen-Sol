"use strict";
// part9/patientor/backend/src/routes/patients.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const patientService_1 = __importDefault(require("../services/patientService"));
const utils_1 = require("../utils");
const router = express_1.default.Router();
router.get("/", (_req, res) => {
    const patientData = patientService_1.default.getNonSensitivePatientData();
    res.json(patientData);
});
router.get("/:id", (req, res) => {
    const patient = patientService_1.default.getPatient(req.params.id);
    if (patient) {
        res.json(patient);
    }
    else {
        res.status(404).send({ Error: "patient not found" });
    }
});
router.post("/", (req, res) => {
    try {
        const newPatient = (0, utils_1.toNewPatient)(req.body);
        const returnedPatient = patientService_1.default.addPatient(newPatient);
        res.json(returnedPatient);
    }
    catch (e) {
        if (e instanceof Error) {
            res.status(400).send({ Error: `${e.message}` });
        }
        else {
            res.status(400).send({ Error: "unknown error" });
        }
    }
});
router.post("/:id/entries", (req, res) => {
    try {
        const id = req.params.id;
        const newEntry = (0, utils_1.toEntry)(req.body);
        const patient = patientService_1.default.addPatientEntry(id, newEntry);
        if (patient) {
            res.json(patient);
        }
        else {
            res.status(404).send({ Error: "patient not found" });
        }
    }
    catch (e) {
        if (e instanceof Error) {
            res.status(400).send({ Error: `${e.message}` });
        }
        else {
            res.status(400).send({ Error: "unknown error" });
        }
    }
});
exports.default = router;
