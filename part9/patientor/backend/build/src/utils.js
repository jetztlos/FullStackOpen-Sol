"use strict";
// part9/patientor/backend/src/utils.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.toEntry = exports.toNewPatient = void 0;
const types_1 = require("./types");
const isString = (text) => {
    return typeof text === "string" || text instanceof String;
};
const isEmptyString = (text) => {
    return text.trim().length === 0;
};
const parseData = (data, name) => {
    if (!isString(data)) {
        throw new Error(`Incorrect data in field: '${name}'`);
    }
    if (isEmptyString(data)) {
        throw new Error(`Missing value in field: '${name}'`);
    }
    return data;
};
const parseGender = (gender) => {
    if (!isString(gender)) {
        throw new Error("Incorrect data in field: 'gender'");
    }
    if (isEmptyString(gender)) {
        throw new Error("Missing value in field: 'gender'");
    }
    switch (gender) {
        case "male":
            return types_1.Gender.Male;
        case "female":
            return types_1.Gender.Female;
        case "other":
            return types_1.Gender.Other;
        default:
            throw new Error(`Unknown gender: '${gender}'`);
    }
};
const toNewPatient = (object) => {
    if (!object) {
        throw new Error("Missing patient data");
    }
    if (typeof object !== "object") {
        throw new Error("Patient data is in incorrect format. Patient data must be an object");
    }
    if (!("name" in object))
        throw new Error("Incorrect data: a 'name' field missing");
    if (!("ssn" in object))
        throw new Error("Incorrect data: a 'ssn' field missing");
    if (!("occupation" in object))
        throw new Error("Incorrect data: a 'occupation' field missing");
    if (!("dateOfBirth" in object))
        throw new Error("Incorrect data: a 'date of birth' field missing");
    if (!("gender" in object))
        throw new Error("Incorrect data: a 'gender' field missing");
    const newPatient = {
        name: parseData(object.name, "name"),
        ssn: parseData(object.ssn, "ssn"),
        occupation: parseData(object.occupation, "occupation"),
        dateOfBirth: parseData(object.dateOfBirth, "dateOfBirth"),
        gender: parseGender(object.gender),
        entries: [],
    };
    return newPatient;
};
exports.toNewPatient = toNewPatient;
const parseDiagnosisCodes = (object) => {
    if (!object || typeof object !== "object" || !("diagnosisCodes" in object)) {
        return [];
    }
    return object.diagnosisCodes;
};
const parseHealthCheckRating = (rating) => {
    if (typeof rating !== "number") {
        throw new Error("Incorrect data in field: 'healthCheckRating'. Data must be a number number");
    }
    if (rating < 0 || rating > 3) {
        throw new Error("Health check rating is out of range. Rating must be between 0 and 3");
    }
    return rating;
};
const parseSickLeave = (object) => {
    if ("sickLeave" in object &&
        object.sickLeave !== null &&
        typeof object.sickLeave === "object" &&
        "startDate" in object.sickLeave &&
        "endDate" in object.sickLeave) {
        return {
            startDate: parseData(object.sickLeave.startDate, "sick leave start date"),
            endDate: parseData(object.sickLeave.endDate, "sick leave end date"),
        };
    }
    return undefined;
};
const toEntry = (object) => {
    if (!object) {
        throw new Error("Missing entry data");
    }
    if (typeof object !== "object") {
        throw new Error("Entry data is in incorrect format. Entry data must be an object");
    }
    if (!("description" in object))
        throw new Error("Incorrect data: a 'description' field missing");
    if (!("date" in object))
        throw new Error("Incorrect data: a 'date' field missing");
    if (!("specialist" in object))
        throw new Error("Incorrect data: a 'specialist' field missing");
    if (!("diagnosisCodes" in object))
        throw new Error("Incorrect data: a 'diagnosisCodes' field missing");
    if (!("type" in object))
        throw new Error("Incorrect data: a 'type' field missing");
    const newEntry = {
        description: parseData(object.description, "description"),
        date: parseData(object.date, "date"),
        specialist: parseData(object.specialist, "specialist"),
        diagnosisCodes: parseDiagnosisCodes(object),
    };
    switch (object.type) {
        case "HealthCheck":
            if (!("healthCheckRating" in object)) {
                throw new Error("Incorrect data: a 'healthCheckRating' field missing");
            }
            return Object.assign(Object.assign({}, newEntry), { type: object.type, healthCheckRating: parseHealthCheckRating(object.healthCheckRating) });
        case "Hospital":
            if (!("discharge" in object)) {
                throw new Error("Incorrect data: a 'healthCheckRating' field missing");
            }
            if (typeof object.discharge !== "object" || object.discharge === null) {
                throw new Error("Incorrect data: a 'discharge' field must be an object");
            }
            if (!("date" in object.discharge)) {
                throw new Error("Incorrect data: a 'date' field missing");
            }
            if (!("criteria" in object.discharge)) {
                throw new Error("Incorrect data: a 'criteria' field missing");
            }
            return Object.assign(Object.assign({}, newEntry), { type: object.type, discharge: {
                    date: parseData(object.discharge.date, "discharge date"),
                    criteria: parseData(object.discharge.criteria, "discharge criteria"),
                } });
        case "OccupationalHealthcare":
            if (!("employerName" in object)) {
                throw new Error("Incorrect data: a 'employerName' field missing");
            }
            return Object.assign(Object.assign({}, newEntry), { type: object.type, employerName: parseData(object.employerName, "employerName"), sickLeave: parseSickLeave(object) });
        default:
            throw new Error(`Unknown entry type: '${object.type}'`);
    }
};
exports.toEntry = toEntry;
