import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { z } from "zod";
import { GameEventData } from ".";
import Socket from "../Socket";

export interface IObserver {
  notifyGameEvent(gameEvent: string, data: any): void;
}

export interface Context {
  prisma: PrismaClient;
  req: Request;
  res: Response;
  socket: Socket;
}
