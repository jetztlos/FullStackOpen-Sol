"use strict";
// part9/patientor/backend/src/services/patientService.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const patients_1 = __importDefault(require("../../data/patients"));
const removeSensitiveData = (patient) => {
    const { id, name, dateOfBirth, gender, occupation } = patient;
    return { id, name, dateOfBirth, gender, occupation };
};
const getNonSensitivePatientData = () => {
    return patients_1.default.map(patient => removeSensitiveData(patient));
};
const addPatient = (newPatient) => {
    const patient = Object.assign({ id: (0, uuid_1.v1)() }, newPatient);
    patients_1.default.push(patient);
    return patient;
};
const getPatient = (id) => {
    return patients_1.default.find(patient => patient.id === id);
};
const addPatientEntry = (id, entry) => {
    const entryId = (0, uuid_1.v1)();
    const newEntry = Object.assign(Object.assign({}, entry), { id: entryId });
    const patient = patients_1.default.find(patient => patient.id === id);
    if (patient) {
        patient.entries.push(newEntry);
    }
    return patient;
};
exports.default = {
    getNonSensitivePatientData,
    addPatient,
    getPatient,
    addPatientEntry
};
