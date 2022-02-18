import { z } from "zod";
import { GameEventData } from ".";

export interface IObserver {
  notifyGameEvent(gameEvent: string, data: any): void;
}
