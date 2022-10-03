import { IUserDB, User, USER_ROLES } from "../models/User";
import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {
  public static USER_TABLE = "Lama_Users";

  public insert = async (user: User): Promise<void> => {
    const newUser: IUserDB = user.toIUserDBModel();

    await BaseDatabase.connection(UserDatabase.USER_TABLE).insert(newUser);
  };

  public selectByEmail = async (
    email: string
  ): Promise<IUserDB | undefined> => {
    const users: IUserDB[] = await BaseDatabase.connection(
      UserDatabase.USER_TABLE
    ).where({ email });

    if (users.length !== 0) {
      const user: IUserDB = users[0];
      return user;
    } else {
      return undefined;
    }
  };
}
