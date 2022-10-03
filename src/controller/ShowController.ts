import { Request, Response } from "express";
import { ShowBusiness } from "../business/ShowBusiness";
import { BaseError } from "../errors/BaseError";
import { ICreateShowDTO, IShowDb, IShowsOutput } from "../models/Show";
import {
  IBookTicketInputDTO,
  IDeleteReservationInputDTO,
} from "../models/Ticket";

export class ShowController {
  constructor(private showBusiness: ShowBusiness) {}

  public create = async (req: Request, res: Response) => {
    try {
      const { band, startsAt } = req.body;
      const token = req.headers.authorization as string;

      const input: ICreateShowDTO = {
        band,
        startsAt,
        token,
      };

      const response = await this.showBusiness.create(input);

      res.status(201).send(response);
    } catch (error: any) {
      if (error instanceof BaseError) {
        return res.status(error.statusCode).send({ message: error.message });
      }
      res.status(500).send({
        message: error.sqlMessage || "Erro inesperado no endpoint Create Show",
      });
    }
  };

  public getAll = async (req: Request, res: Response) => {
    try {
      const response: IShowsOutput[] = await this.showBusiness.getAll();

      res.status(200).send(response);
    } catch (error: any) {
      if (error instanceof BaseError) {
        return res.status(error.statusCode).send({ message: error.message });
      }
      res.status(500).send({
        message:
          error.sqlMessage || "Erro inesperado no endpoint Get All Tickets",
      });
    }
  };

  public bookTicket = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization as string;
      const showId = req.params.id;

      const input: IBookTicketInputDTO = {
        showId,
        token,
      };

      const response = await this.showBusiness.bookTicket(input);

      res.status(201).send(response);
    } catch (error: any) {
      if (error instanceof BaseError) {
        return res.status(error.statusCode).send({ message: error.message });
      }
      res.status(500).send({
        message: error.sqlMessage || "Erro inesperado no endpoint Book Ticket",
      });
    }
  };

  public deleteReservation = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization as string;
      const showId = req.params.id;

      const input: IDeleteReservationInputDTO = {
        showId,
        token,
      };

      const response = await this.showBusiness.deleteReservation(input);

      res.status(200).send(response);
    } catch (error: any) {
      if (error instanceof BaseError) {
        return res.status(error.statusCode).send({ message: error.message });
      }
      res.status(500).send({
        message:
          error.sqlMessage ||
          "Erro inesperado no endpoint Delete Ticket Reservation",
      });
    }
  };
}
