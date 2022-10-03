import { UserDatabase } from "../database/UserDatabase";
import { ConflictError } from "../errors/ConflictError";
import { NotFoundError } from "../errors/NotFoundError";
import { ParamsError } from "../errors/ParamsError";
import { UnprocessableError } from "../errors/UnprocessableError";
import { AuthenticationError } from "../errors/AuthenticationError";
import { AuthorizationError } from "../errors/AuthorizationError";
import { ILoginInputDTO, USER_ROLES } from "../models/User";
import { Authenticator, ITokenPayload } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";
import { ShowDatabase } from "../database/ShowDatabase";
import { ICreateShowDTO, IShowDb, IShowsOutput, Show } from "../models/Show";
import moment from "moment";
import {
  IBookTicketInputDTO,
  IDeleteReservationInputDTO,
  IShowUserInputDTO,
  ITicketDB,
  Ticket,
} from "../models/Ticket";

export class ShowBusiness {
  constructor(
    private showDatabase: ShowDatabase,
    private idGenerator: IdGenerator,
    private authenticator: Authenticator
  ) {}

  public create = async (showData: ICreateShowDTO) => {
    const { band, startsAt, token } = showData;

    if (!band || !startsAt) {
      throw new ParamsError("Missing parameters");
    }

    if (!token) {
      throw new ParamsError("Missing token");
    }

    const tokenData: ITokenPayload | null =
      this.authenticator.getTokenPayload(token);

    if (!tokenData) {
      throw new AuthenticationError("Invalid token");
    }

    if (tokenData.role !== USER_ROLES.ADMIN) {
      throw new AuthorizationError("Only admins can create shows");
    }

    const id: string = this.idGenerator.generate();

    const dateSplit: string[] = startsAt.split("/" || ".");

    let date: Date;

    if (
      dateSplit[0].length === 4 &&
      dateSplit[1]?.length === 2 &&
      dateSplit[2]?.length === 2
    ) {
      date = new Date(startsAt);
    } else if (
      dateSplit[0].length === 2 &&
      dateSplit[1]?.length === 2 &&
      dateSplit[2]?.length === 4
    ) {
      date = new Date(moment(startsAt, "DD/MM/YYYY").format("YYYY/MM/DD"));
    } else {
      throw new UnprocessableError("Invalid date");
    }

    if (date < new Date("2022/12/05")) {
      throw new UnprocessableError(`Date must be greater than 05/12/2022`);
    }

    const newShow = new Show(id, band, date);

    await this.showDatabase.insert(newShow);

    return {
      message: "Show created successfully",
    };
  };

  public getAll = async () => {
    const shows: IShowDb[] = await this.showDatabase.selectAll();

    if (shows.length === 0) {
      throw new NotFoundError("No shows were found");
    }

    const showsOutput: IShowsOutput[] = shows.map((show) => {
      return {
        band: show.band,
        startsAt: show.starts_at.toLocaleDateString(),
        availableTickets: Number(show.available_tickets),
      };
    });

    return showsOutput;
  };

  public bookTicket = async (input: IBookTicketInputDTO) => {
    const { showId, token } = input;

    if (!showId || showId === ":id") {
      throw new ParamsError("Missing parameter: show id");
    }

    if (!token) {
      throw new ParamsError("Missing token");
    }

    const tokenData = this.authenticator.getTokenPayload(token);

    if (!tokenData) {
      throw new AuthenticationError("Invalid Token");
    }

    const show: IShowDb | undefined = await this.showDatabase.selectById(
      showId
    );

    if (!show) {
      throw new NotFoundError("Show not found");
    }

    const dataToSearch: IShowUserInputDTO = {
      user_id: tokenData.id,
      show_id: showId,
    };

    const ticket: ITicketDB | undefined =
      await this.showDatabase.selectByUserAndShow(dataToSearch);

    if (ticket) {
      throw new ConflictError("Only one ticket per user is allowed");
    }

    const newTicket = new Ticket(
      this.idGenerator.generate(),
      showId,
      tokenData.id
    );

    await this.showDatabase.bookTicket(newTicket);

    return {
      message: "Ticket booked Sucessfully",
    };
  };

  public deleteReservation = async (input: IDeleteReservationInputDTO) => {
    const { showId, token } = input;

    if (!showId || showId === ":id") {
      throw new ParamsError("Missing parameter: show id");
    }

    if (!token) {
      throw new ParamsError("Missing token");
    }

    const tokenData = this.authenticator.getTokenPayload(token);

    if (!tokenData) {
      throw new AuthenticationError("Invalid Token");
    }

    const show: IShowDb | undefined = await this.showDatabase.selectById(
      showId
    );

    if (!show) {
      throw new NotFoundError("Show not found");
    }

    const dataToSearch: IShowUserInputDTO = {
      user_id: tokenData.id,
      show_id: showId,
    };

    const ticket: ITicketDB | undefined =
      await this.showDatabase.selectByUserAndShow(dataToSearch);

    if (!ticket) {
      throw new NotFoundError("No have reservation for this show");
    }

    await this.showDatabase.deleteReservation(ticket.id);

    return {
      message: "Reservation deleted Sucessfully",
    };
  };
}
