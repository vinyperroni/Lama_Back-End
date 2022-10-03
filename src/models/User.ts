export enum USER_ROLES {
  NORMAL = "NORMAL",
  ADMIN = "ADMIN",
}

export interface IUserDB {
  id: string;
  name: string;
  email: string;
  password: string;
  role: USER_ROLES;
}

export interface ISignupInputDTO {
  name: string;
  email: string;
  password: string;
  role?: USER_ROLES;
}

export interface ILoginInputDTO {
  email: string;
  password: string;
}

export class User {
  constructor(
    private id: string,
    private name: string,
    private email: string,
    private password: string,
    private role: USER_ROLES
  ) {}

  public toIUserDBModel = (): IUserDB => {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role,
    };
  };

  public getId = () => this.id;

  public getName = () => this.name;

  public getEmail = () => this.email;

  public getPassword = () => this.password;

  public getRole = () => this.role;

  public setId = (newId: string) => {
    this.id = newId;
  };

  public setName = (newName: string) => {
    this.name = newName;
  };

  public setEmail = (newEmail: string) => {
    this.email = newEmail;
  };

  public setPassword = (newPassword: string) => {
    this.password = newPassword;
  };

  public setRole = (newRole: USER_ROLES) => {
    this.role = newRole;
  };
}
