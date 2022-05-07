import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { z } from "zod";
import { GameEventData } from ".";
import { CsvDb } from "../csvDbClient";
import PrestoClient from "../PrestoClient";
import Socket from "../Socket";
import * as dataForge from "data-forge";

export interface IObserver {
  notifyGameEvent(gameEvent: string, data: any): void;
}

export interface Context {
  csvDbClient: CsvDb;
  dataForge: typeof dataForge;
  prisma: PrismaClient;
  presto: PrestoClient;
  req: Request;
  res: Response;
  socket: Socket;
}
