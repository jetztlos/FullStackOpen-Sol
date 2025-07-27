"use strict";
// part9/patientor/backend/src/index.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const diagnoses_1 = __importDefault(require("./routes/diagnoses"));
const patients_1 = __importDefault(require("./routes/patients"));
const ping_1 = __importDefault(require("./routes/ping"));
const app = (0, express_1.default)();
const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173'];
const options = {
    origin: allowedOrigins
};
app.use((0, cors_1.default)(options));
app.use(express_1.default.json());
const PORT = 3001;
app.use("/api/diagnoses", diagnoses_1.default);
app.use("/api/patients", patients_1.default);
app.use("/api/ping", ping_1.default);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
