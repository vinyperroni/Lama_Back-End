import { BaseDatabase } from "../../src/database/BaseDatabase";
import { IShowDb, Show } from "../../src/models/Show";
import { IShowUserInputDTO, ITicketDB, Ticket } from "../../src/models/Ticket";

export class ShowDatabaseMock extends BaseDatabase {
  public static SHOW_TABLE = "Lama_Shows";
  public static TICKET_TABLE = "Lama_Tickets";

  public insert = async (show: Show): Promise<void> => {};

  public selectAll = async (): Promise<IShowDb[]> => {
    const shows: IShowDb[] = [
      {
        id: "id-mock",
        band: "Band-Mock",
        starts_at: new Date("2022/10/10"),
        available_tickets: 5000,
      },
      {
        id: "id-mock",
        band: "Band-Mock-4",
        starts_at: new Date("2022/10/06"),
        available_tickets: 5000,
      },
      {
        id: "id-mock",
        band: "Band-Mock-3",
        starts_at: new Date("2022/10/08"),
        available_tickets: 5000,
      },
    ];

    return shows;
  };

  public selectById = async (id: string): Promise<IShowDb | undefined> => {
    switch (id) {
      case "id-mock":
        return {
          id: "id-mock",
          band: "Band-Mock",
          starts_at: new Date("2022/10/10"),
          available_tickets: 5000,
        };
      case "old-id-mock":
        return {
          id: "old-id-mock",
          band: "Band-Mock2",
          starts_at: new Date("2022/10/10"),
          available_tickets: 5000,
        };
      default:
        return undefined;
    }
  };

  public selectByUserAndShow = async (
    input: IShowUserInputDTO
  ): Promise<ITicketDB | undefined> => {
    if (input.show_id === "old-id-mock" && input.user_id === "id-mock") {
      return {
        id: "id-mock",
        show_id: "id-mock",
        user_id: "id-mock",
      };
    } else {
      return undefined;
    }
  };

  public bookTicket = async (ticket: Ticket): Promise<void> => {};

  public deleteReservation = async (id: string): Promise<void> => {};
}
