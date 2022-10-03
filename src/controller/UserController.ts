import { Request, Response } from "express";
import { UserBusiness } from "../business/UserBusiness";
import { BaseError } from "../errors/BaseError";
import { ILoginInputDTO, ISignupInputDTO } from "../models/User";

export class UserController {
  constructor(private userBusiness: UserBusiness) {}

  public signup = async (req: Request, res: Response) => {
    try {
      const { name, email, password, role } = req.body;

      const input: ISignupInputDTO = {
        name,
        email,
        password,
        role,
      };

      const response = await this.userBusiness.signup(input);

      res.status(201).send(response);
    } catch (error: any) {
      if (error instanceof BaseError) {
        return res.status(error.statusCode).send({ message: error.message });
      }
      res.status(500).send({
        message: error.sqlMessage || "Erro inesperado no endpoint signup",
      });
    }
  };

  public login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const input: ILoginInputDTO = {
        email,
        password,
      };

      const response = await this.userBusiness.login(input);

      res.status(200).send(response);
    } catch (error: any) {
      if (error instanceof BaseError) {
        return res.status(error.statusCode).send({ message: error.message });
      }
      res.status(500).send({
        message: error.sqlMessage || "Erro inesperado no endpoint login",
      });
    }
  };
}
