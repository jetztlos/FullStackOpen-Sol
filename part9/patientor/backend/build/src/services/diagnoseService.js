"use strict";
// part9/patientor/backend/src/services/diagnoseService.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const diagnoses_1 = __importDefault(require("../../data/diagnoses"));
const getDiagnoses = () => {
    return diagnoses_1.default;
};
exports.default = {
    getDiagnoses
};
