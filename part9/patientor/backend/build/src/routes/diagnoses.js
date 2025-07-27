"use strict";
// part9/patientor/backend/src/routes/diagnoses.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const diagnoseService_1 = __importDefault(require("../services/diagnoseService"));
const router = express_1.default.Router();
router.get("/", (_req, res) => {
    const diagnoses = diagnoseService_1.default.getDiagnoses();
    res.json(diagnoses);
});
exports.default = router;
