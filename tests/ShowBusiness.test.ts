import { ShowBusiness } from "../src/business/ShowBusiness";
import { BaseError } from "../src/errors/BaseError";
import { ICreateShowDTO, IShowsOutput } from "../src/models/Show";
import {
  IBookTicketInputDTO,
  IDeleteReservationInputDTO,
} from "../src/models/Ticket";
import { AuthenticatorMock } from "./mocks/AuthenticatorMock";
import { IdGeneratorMock } from "./mocks/IdGeneratorMock";
import { ShowDatabaseMock } from "./mocks/ShowDatabaseMock";

describe("Testando a ShowBusiness", () => {
  const showBusiness = new ShowBusiness(
    new ShowDatabaseMock(),
    new IdGeneratorMock(),
    new AuthenticatorMock()
  );

  test("Create - Uma mensagem de sucesso é retornada quando o show é criado", async () => {
    const input: ICreateShowDTO = {
      band: "Mock Band",
      startsAt: "20/12/2022",
      token: "token-mock-admin",
    };

    const response = await showBusiness.create(input);

    expect(response.message).toBe("Show created successfully");
  });

  test("Get All - Uma lista com 3 shows é retornada", async () => {
    const response = await showBusiness.getAll();

    expect(response.length).toBe(3);
  });

  test("Book Ticket - Uma mensagem de sucesso é retornada quando o ticket é reservado", async () => {
    const input: IBookTicketInputDTO = {
      showId: "id-mock",
      token: "token-mock-admin",
    };

    const response = await showBusiness.bookTicket(input);

    expect(response.message).toBe("Ticket booked Sucessfully");
  });

  test("Delete Reservation - Uma mensagem de sucesso é retornada quando a reserva é deletada", async () => {
    const input: IDeleteReservationInputDTO = {
      showId: "old-id-mock",
      token: "token-mock-admin",
    };

    const response = await showBusiness.deleteReservation(input);

    expect(response.message).toBe("Reservation deleted Sucessfully");
  });

  test("Create - Retorna erro caso o band seja uma string vazia", async () => {
    expect.assertions(2);

    try {
      const input: ICreateShowDTO = {
        band: "",
        startsAt: "20/12/2022",
        token: "token-mock-admin",
      };

      await showBusiness.create(input);
    } catch (error: unknown) {
      if (error instanceof BaseError) {
        expect(error.statusCode).toEqual(400);
        expect(error.message).toEqual("Missing parameters");
      }
    }
  });

  test("Create - Retorna erro caso o startsAt seja uma string vazia", async () => {
    expect.assertions(2);

    try {
      const input: ICreateShowDTO = {
        band: "Mock Band",
        startsAt: "",
        token: "token-mock-admin",
      };

      await showBusiness.create(input);
    } catch (error: unknown) {
      if (error instanceof BaseError) {
        expect(error.statusCode).toEqual(400);
        expect(error.message).toEqual("Missing parameters");
      }
    }
  });

  test("Create - Retorna erro caso o token seja uma string vazia", async () => {
    expect.assertions(2);

    try {
      const input: ICreateShowDTO = {
        band: "Mock Band",
        startsAt: "2022/12/10",
        token: "",
      };

      await showBusiness.create(input);
    } catch (error: unknown) {
      if (error instanceof BaseError) {
        expect(error.statusCode).toEqual(400);
        expect(error.message).toEqual("Missing token");
      }
    }
  });

  test("Create - Retorna erro caso o token seja invalido", async () => {
    expect.assertions(2);

    try {
      const input: ICreateShowDTO = {
        band: "Mock Band",
        startsAt: "2022/12/10",
        token: "token-invalido",
      };

      await showBusiness.create(input);
    } catch (error: unknown) {
      if (error instanceof BaseError) {
        expect(error.statusCode).toEqual(401);
        expect(error.message).toEqual("Invalid token");
      }
    }
  });

  test("Create - Retorna erro caso o token não seja de um user ADMIN", async () => {
    expect.assertions(2);

    try {
      const input: ICreateShowDTO = {
        band: "Mock Band",
        startsAt: "2022/12/10",
        token: "token-mock-normal",
      };

      await showBusiness.create(input);
    } catch (error: unknown) {
      if (error instanceof BaseError) {
        expect(error.statusCode).toEqual(403);
        expect(error.message).toEqual("Only admins can create shows");
      }
    }
  });

  test("Create - Retorna erro caso a data seja invalida", async () => {
    expect.assertions(2);

    try {
      const input: ICreateShowDTO = {
        band: "Mock Band",
        startsAt: "1074",
        token: "token-mock-admin",
      };

      await showBusiness.create(input);
    } catch (error: unknown) {
      if (error instanceof BaseError) {
        expect(error.statusCode).toEqual(422);
        expect(error.message).toEqual("Invalid date");
      }
    }
  });

  test("Create - Retorna erro caso a data seja anterior a 05/12/2022", async () => {
    expect.assertions(2);

    try {
      const input: ICreateShowDTO = {
        band: "Mock Band",
        startsAt: "04/12/2022",
        token: "token-mock-admin",
      };

      await showBusiness.create(input);
    } catch (error: unknown) {
      if (error instanceof BaseError) {
        expect(error.statusCode).toEqual(422);
        expect(error.message).toEqual("Date must be greater than 05/12/2022");
      }
    }
  });

  test("Book Ticket - Retorna erro caso o showId não seja informado", async () => {
    expect.assertions(2);

    try {
      const input: IBookTicketInputDTO = {
        showId: "",
        token: "token-mock-admin",
      };

      await showBusiness.bookTicket(input);
    } catch (error: unknown) {
      if (error instanceof BaseError) {
        expect(error.statusCode).toEqual(400);
        expect(error.message).toEqual("Missing parameter: show id");
      }
    }
  });

  test("Book Ticket - Retorna erro caso o token não seja informado", async () => {
    expect.assertions(2);

    try {
      const input: IBookTicketInputDTO = {
        showId: "id-mock",
        token: "",
      };

      await showBusiness.bookTicket(input);
    } catch (error: unknown) {
      if (error instanceof BaseError) {
        expect(error.statusCode).toEqual(400);
        expect(error.message).toEqual("Missing token");
      }
    }
  });

  test("Book Ticket - Retorna erro caso o token seja invalido", async () => {
    expect.assertions(2);

    try {
      const input: IBookTicketInputDTO = {
        showId: "id-mock",
        token: "token-invalid",
      };

      await showBusiness.bookTicket(input);
    } catch (error: unknown) {
      if (error instanceof BaseError) {
        expect(error.statusCode).toEqual(401);
        expect(error.message).toEqual("Invalid Token");
      }
    }
  });

  test("Book Ticket - Retorna erro caso o show nao exista", async () => {
    expect.assertions(2);

    try {
      const input: IBookTicketInputDTO = {
        showId: "id-mock-falso",
        token: "token-mock-admin",
      };

      await showBusiness.bookTicket(input);
    } catch (error: unknown) {
      if (error instanceof BaseError) {
        expect(error.statusCode).toEqual(404);
        expect(error.message).toEqual("Show not found");
      }
    }
  });

  test("Book Ticket - Retorna erro caso o usuario ja tenha ticket reservado para o show", async () => {
    expect.assertions(2);

    try {
      const input: IBookTicketInputDTO = {
        showId: "old-id-mock",
        token: "token-mock-admin",
      };

      await showBusiness.bookTicket(input);
    } catch (error: unknown) {
      if (error instanceof BaseError) {
        expect(error.statusCode).toEqual(409);
        expect(error.message).toEqual("Only one ticket per user is allowed");
      }
    }
  });

  test("Delete Reservation - Retorna erro caso o showId não seja informado", async () => {
    expect.assertions(2);

    try {
      const input: IDeleteReservationInputDTO = {
        showId: "",
        token: "token-mock-admin",
      };

      await showBusiness.deleteReservation(input);
    } catch (error: unknown) {
      if (error instanceof BaseError) {
        expect(error.statusCode).toEqual(400);
        expect(error.message).toEqual("Missing parameter: show id");
      }
    }
  });

  test("Delete Reservation - Retorna erro caso o token não seja informado", async () => {
    expect.assertions(2);

    try {
      const input: IDeleteReservationInputDTO = {
        showId: "id-mock",
        token: "",
      };

      await showBusiness.deleteReservation(input);
    } catch (error: unknown) {
      if (error instanceof BaseError) {
        expect(error.statusCode).toEqual(400);
        expect(error.message).toEqual("Missing token");
      }
    }
  });

  test("Delete Reservation - Retorna erro caso o token seja invalido", async () => {
    expect.assertions(2);

    try {
      const input: IDeleteReservationInputDTO = {
        showId: "id-mock",
        token: "token-invalid",
      };

      await showBusiness.deleteReservation(input);
    } catch (error: unknown) {
      if (error instanceof BaseError) {
        expect(error.statusCode).toEqual(401);
        expect(error.message).toEqual("Invalid Token");
      }
    }
  });

  test("Delete Reservation - Retorna erro caso o show nao exista", async () => {
    expect.assertions(2);

    try {
      const input: IDeleteReservationInputDTO = {
        showId: "id-mock-falso",
        token: "token-mock-admin",
      };

      await showBusiness.deleteReservation(input);
    } catch (error: unknown) {
      if (error instanceof BaseError) {
        expect(error.statusCode).toEqual(404);
        expect(error.message).toEqual("Show not found");
      }
    }
  });

  test("Delete Reservation - Retorna erro caso o usuario não tenha ticket reservado para o show", async () => {
    expect.assertions(2);

    try {
      const input: IDeleteReservationInputDTO = {
        showId: "id-mock",
        token: "token-mock-admin",
      };

      await showBusiness.deleteReservation(input);
    } catch (error: unknown) {
      if (error instanceof BaseError) {
        expect(error.statusCode).toEqual(404);
        expect(error.message).toEqual("No have reservation for this show");
      }
    }
  });
});
