import { IShowDb, Show } from "../models/Show";
import { IShowUserInputDTO, ITicketDB, Ticket } from "../models/Ticket";
import { BaseDatabase } from "./BaseDatabase";

export class ShowDatabase extends BaseDatabase {
  public static SHOW_TABLE = "Lama_Shows";
  public static TICKET_TABLE = "Lama_Tickets";

  public insert = async (show: Show): Promise<void> => {
    const newShow: IShowDb = show.toIShowDBModel();

    await BaseDatabase.connection(ShowDatabase.SHOW_TABLE).insert(newShow);
  };

  public selectAll = async (): Promise<IShowDb[]> => {
    const shows: IShowDb[] = await BaseDatabase.connection
      .select()
      .from(ShowDatabase.SHOW_TABLE);

    return shows;
  };

  public selectById = async (id: string): Promise<IShowDb | undefined> => {
    const shows: IShowDb[] = await BaseDatabase.connection
      .select()
      .from(ShowDatabase.SHOW_TABLE)
      .where({ id });
    const show: IShowDb = shows[0];

    return show;
  };

  public selectByUserAndShow = async (
    input: IShowUserInputDTO
  ): Promise<ITicketDB | undefined> => {
    const tickets: ITicketDB[] = await BaseDatabase.connection
      .select()
      .from(ShowDatabase.TICKET_TABLE)
      .where({ user_id: input.user_id })
      .andWhere({ show_id: input.show_id });
    const ticket: ITicketDB = tickets[0];

    return ticket;
  };

  public bookTicket = async (ticket: Ticket): Promise<void> => {
    const newTicket: ITicketDB = ticket.toIShowDBModel();

    await BaseDatabase.connection(ShowDatabase.TICKET_TABLE).insert(newTicket);
    await BaseDatabase.connection.raw(
      `
      UPDATE ${ShowDatabase.SHOW_TABLE}
      SET available_tickets = available_tickets - 1
      WHERE id = "053e16c9-d803-4b3c-b470-7382feacd03f";
      `
    );
  };

  public deleteReservation = async (id: string): Promise<void> => {
    await BaseDatabase.connection(ShowDatabase.TICKET_TABLE)
      .delete()
      .where({ id });
  };
}
