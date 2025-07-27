// part9/patientor/frontend/src/services/diagnoses.ts

import axios from "axios";
import { Diagnosis } from "../types";

import { apiBaseUrl } from "../constants";

const getAll = async () => {
  const { data: diagnoses } = await axios.get<Diagnosis[]>(`${apiBaseUrl}/diagnoses`);
  return diagnoses;
};

export default {
  getAll
};
