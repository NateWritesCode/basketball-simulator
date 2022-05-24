import { Request, Response } from "express";
import Socket from "../../server-old/src/Socket";
import * as dataForge from "data-forge";
import { csvDb } from "../utils/csvDb";
import { dataClient } from "../utils/dataClient";
import { Data } from "@serverless/cloud";

export interface IObserver {
  notifyGameEvent(gameEvent: string, data: any): void;
}

export interface Context {
  // dataForge: typeof dataForge;
  // req: Request;
  // res: Response;
  csvDb: typeof csvDb;
  data: Data;
}
