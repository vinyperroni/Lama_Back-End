import { UserDatabase } from "../database/UserDatabase";
import { ConflictError } from "../errors/ConflictError";
import { NotFoundError } from "../errors/NotFoundError";
import { ParamsError } from "../errors/ParamsError";
import { UnprocessableError } from "../errors/UnprocessableError";
import { AuthenticationError } from "../errors/AuthenticationError";
import {
  ILoginInputDTO,
  ISignupInputDTO,
  User,
  USER_ROLES,
} from "../models/User";
import { Authenticator, ITokenPayload } from "../services/Authenticator";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";

export class UserBusiness {
  constructor(
    private userDatabase: UserDatabase,
    private idGenerator: IdGenerator,
    private hashManager: HashManager,
    private authenticator: Authenticator
  ) {}

  public signup = async (userData: ISignupInputDTO) => {
    const { name, email, password } = userData;
    let { role } = userData;

    if (!role) {
      role = USER_ROLES.NORMAL;
    }

    if (!name || !email || !password) {
      throw new ParamsError("Missing parameters");
    }

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      throw new UnprocessableError("Wrong type parameters");
    }

    if (password.length < 6) {
      throw new UnprocessableError("Password must be 6 or more characters");
    }

    if (name.length < 3) {
      throw new UnprocessableError("Name must be 3 or more characters");
    }

    if (
      !email.match(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      )
    ) {
      throw new UnprocessableError("Invalid parameter: email");
    }

    const user = await this.userDatabase.selectByEmail(email);

    if (user) {
      throw new ConflictError("Email already registered");
    }

    const id: string = this.idGenerator.generate();
    const hashPassword = await this.hashManager.hash(password);

    const newUser = new User(id, name, email, hashPassword, role);

    await this.userDatabase.insert(newUser);

    const tokenPayload: ITokenPayload = {
      id,
      role,
    };

    const token = this.authenticator.generateToken(tokenPayload);

    return {
      message: "User created successfully",
      token,
    };
  };

  public login = async (userData: ILoginInputDTO) => {
    const { email, password } = userData;

    if (!email || !password) {
      throw new ParamsError("Missing parameters");
    }

    if (typeof email !== "string" || typeof password !== "string") {
      throw new UnprocessableError("Wrong type parameters");
    }

    if (password.length < 6) {
      throw new UnprocessableError("Password must be 6 or more characters");
    }

    if (
      !email.match(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      )
    ) {
      throw new UnprocessableError("Invalid parameter: email");
    }

    const user = await this.userDatabase.selectByEmail(email);

    if (!user) {
      throw new NotFoundError("User Not Found");
    }

    const isValidPassword = await this.hashManager.compare(
      password,
      user.password
    );

    if (!isValidPassword) {
      throw new AuthenticationError();
    }

    const tokenPayload: ITokenPayload = {
      id: user.id,
      role: user.role,
    };

    const token = this.authenticator.generateToken(tokenPayload);

    return {
      message: "Successfully logged in",
      token,
    };
  };
}
