import { UserBusiness } from "../src/business/UserBusiness";
import { BaseError } from "../src/errors/BaseError";
import { ILoginInputDTO, ISignupInputDTO } from "../src/models/User";
import { AuthenticatorMock } from "./mocks/AuthenticatorMock";
import { HashManagerMock } from "./mocks/HashManagerMock";
import { IdGeneratorMock } from "./mocks/IdGeneratorMock";
import { UserDatabaseMock } from "./mocks/UserDatabaseMock";

describe("Testando a UserBusiness", () => {
  const userBusiness = new UserBusiness(
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new HashManagerMock(),
    new AuthenticatorMock()
  );

  test("Signup - Um token e uma mensagem é retornado quando o cadastro é bem-sucedido", async () => {
    const input: ISignupInputDTO = {
      email: "fulano@gmail.com",
      name: "Fulano",
      password: "fulano123",
    };

    const response = await userBusiness.signup(input);
    expect(response.message).toBe("User created successfully");
    expect(response.token).toBe("token-mock-normal");
  });

  test("Login - Um token e uma mensagem é retornado quando o login é bem-sucedido", async () => {
    const input: ILoginInputDTO = {
      email: "astrodev@gmail.com",
      password: "bananinha",
    };

    const response = await userBusiness.login(input);
    expect(response.message).toBe("Successfully logged in");
    expect(response.token).toBe("token-mock-admin");
  });

  test("Signup - Retorna erro caso o name seja uma string vazia", async () => {
    expect.assertions(2);

    try {
      const input: ISignupInputDTO = {
        email: "fulano@gmail.com",
        name: "",
        password: "bananinha",
      };

      await userBusiness.signup(input);
    } catch (error: unknown) {
      if (error instanceof BaseError) {
        expect(error.statusCode).toEqual(400);
        expect(error.message).toEqual("Missing parameters");
      }
    }
  });

  test("Signup - Retorna erro caso o email seja uma string vazia", async () => {
    expect.assertions(2);

    try {
      const input: ISignupInputDTO = {
        email: "",
        name: "Fulano",
        password: "bananinha",
      };

      await userBusiness.signup(input);
    } catch (error: unknown) {
      if (error instanceof BaseError) {
        expect(error.statusCode).toEqual(400);
        expect(error.message).toEqual("Missing parameters");
      }
    }
  });

  test("Signup - Retorna erro caso o password seja uma string vazia", async () => {
    expect.assertions(2);

    try {
      const input: ISignupInputDTO = {
        email: "fulano@gmail.com",
        name: "Fulano",
        password: "",
      };

      await userBusiness.signup(input);
    } catch (error: unknown) {
      if (error instanceof BaseError) {
        expect(error.statusCode).toEqual(400);
        expect(error.message).toEqual("Missing parameters");
      }
    }
  });

  test("Signup - Retorna erro caso o name tenha tipo diferente de string", async () => {
    expect.assertions(2);

    try {
      const input = {
        email: "fulano@gmail.com",
        name: 10,
        password: "bananinha",
      } as unknown as ISignupInputDTO;

      await userBusiness.signup(input);
    } catch (error: unknown) {
      if (error instanceof BaseError) {
        expect(error.message).toEqual("Wrong type parameters");
        expect(error.statusCode).toEqual(422);
      }
    }
  });

  test("Signup - Retorna erro caso o email tenha tipo diferente de string", async () => {
    expect.assertions(2);

    try {
      const input = {
        email: 10,
        name: "Fulano",
        password: "bananinha",
      } as unknown as ISignupInputDTO;

      await userBusiness.signup(input);
    } catch (error: unknown) {
      if (error instanceof BaseError) {
        expect(error.message).toEqual("Wrong type parameters");
        expect(error.statusCode).toEqual(422);
      }
    }
  });

  test("Signup - Retorna erro caso o password tenha tipo diferente de string", async () => {
    expect.assertions(2);

    try {
      const input = {
        email: "fulano@gmail.com",
        name: "Fulano",
        password: 10,
      } as unknown as ISignupInputDTO;

      await userBusiness.signup(input);
    } catch (error: unknown) {
      if (error instanceof BaseError) {
        expect(error.message).toEqual("Wrong type parameters");
        expect(error.statusCode).toEqual(422);
      }
    }
  });

  test("Signup - Erro quando 'password' for menor que 6 caracteres", async () => {
    expect.assertions(2);

    try {
      const input: ISignupInputDTO = {
        email: "fulano@gmail.com",
        name: "Fulano",
        password: "bana",
      };

      await userBusiness.signup(input);
    } catch (error) {
      if (error instanceof BaseError) {
        expect(error.statusCode).toBe(422);
        expect(error.message).toBe("Password must be 6 or more characters");
      }
    }
  });

  test("Signup - Erro quando 'name' for menor que 3 caracteres", async () => {
    expect.assertions(2);

    try {
      const input: ISignupInputDTO = {
        email: "fulano@gmail.com",
        name: "Fu",
        password: "banana",
      };

      await userBusiness.signup(input);
    } catch (error) {
      if (error instanceof BaseError) {
        expect(error.statusCode).toBe(422);
        expect(error.message).toBe("Name must be 3 or more characters");
      }
    }
  });

  test("Signup - Erro quando o email não seguir o regex", async () => {
    expect.assertions(2);

    try {
      const input: ISignupInputDTO = {
        email: "fulanogmailcom",
        name: "Fulano",
        password: "banana",
      };

      await userBusiness.signup(input);
    } catch (error: unknown) {
      if (error instanceof BaseError) {
        expect(error.statusCode).toEqual(422);
        expect(error.message).toEqual("Invalid parameter: email");
      }
    }
  });

  test("Signup - Erro quando o email já for cadastrado", async () => {
    expect.assertions(2);

    try {
      const input: ISignupInputDTO = {
        email: "usermock@gmail.com",
        name: "User Mock",
        password: "banananinha",
      };

      await userBusiness.signup(input);
    } catch (error: unknown) {
      if (error instanceof BaseError) {
        expect(error.statusCode).toEqual(409);
        expect(error.message).toEqual("Email already registered");
      }
    }
  });

  test("Login - Retorna erro caso o email seja uma string vazia", async () => {
    expect.assertions(2);

    try {
      const input: ILoginInputDTO = {
        email: "",
        password: "bananinha",
      };

      await userBusiness.login(input);
    } catch (error: unknown) {
      if (error instanceof BaseError) {
        expect(error.statusCode).toEqual(400);
        expect(error.message).toEqual("Missing parameters");
      }
    }
  });

  test("Login - Retorna erro caso o password seja uma string vazia", async () => {
    expect.assertions(2);

    try {
      const input: ILoginInputDTO = {
        email: "fulano@gmail.com",
        password: "",
      };

      await userBusiness.login(input);
    } catch (error: unknown) {
      if (error instanceof BaseError) {
        expect(error.statusCode).toEqual(400);
        expect(error.message).toEqual("Missing parameters");
      }
    }
  });

  test("Login - Retorna erro caso o email tenha tipo diferente de string", async () => {
    expect.assertions(2);

    try {
      const input = {
        email: 10,
        password: "bananinha",
      } as unknown as ILoginInputDTO;

      await userBusiness.login(input);
    } catch (error: unknown) {
      if (error instanceof BaseError) {
        expect(error.message).toEqual("Wrong type parameters");
        expect(error.statusCode).toEqual(422);
      }
    }
  });

  test("Login - Retorna erro caso o password tenha tipo diferente de string", async () => {
    expect.assertions(2);

    try {
      const input = {
        email: "fulano@gmail.com",
        password: 10,
      } as unknown as ILoginInputDTO;

      await userBusiness.login(input);
    } catch (error: unknown) {
      if (error instanceof BaseError) {
        expect(error.message).toEqual("Wrong type parameters");
        expect(error.statusCode).toEqual(422);
      }
    }
  });

  test("Login - Erro quando 'password' for menor que 6 caracteres", async () => {
    expect.assertions(2);

    try {
      const input: ILoginInputDTO = {
        email: "fulano@gmail.com",
        password: "bana",
      };

      await userBusiness.login(input);
    } catch (error) {
      if (error instanceof BaseError) {
        expect(error.statusCode).toBe(422);
        expect(error.message).toBe("Password must be 6 or more characters");
      }
    }
  });

  test("Login - Erro quando o email não seguir o regex", async () => {
    expect.assertions(2);

    try {
      const input: ILoginInputDTO = {
        email: "fulanogmailcom",
        password: "banana",
      };

      await userBusiness.login(input);
    } catch (error: unknown) {
      if (error instanceof BaseError) {
        expect(error.statusCode).toEqual(422);
        expect(error.message).toEqual("Invalid parameter: email");
      }
    }
  });

  test("Login - Erro quando o email não for registrado", async () => {
    expect.assertions(2);

    try {
      const input: ILoginInputDTO = {
        email: "fulano@gmailcom",
        password: "banananinha",
      };

      await userBusiness.login(input);
    } catch (error: unknown) {
      if (error instanceof BaseError) {
        expect(error.statusCode).toEqual(404);
        expect(error.message).toEqual("User Not Found");
      }
    }
  });

  test("Login - Erro quando a senha for incorreta", async () => {
    expect.assertions(2);

    try {
      const input: ILoginInputDTO = {
        email: "astrodev@gmail.com",
        password: "1234567",
      };

      await userBusiness.login(input);
    } catch (error: unknown) {
      if (error instanceof BaseError) {
        expect(error.statusCode).toEqual(401);
        expect(error.message).toEqual("Invalid credentials");
      }
    }
  });
});
