export interface ITicketDB {
  id: string;
  show_id: string;
  user_id: string;
}

export interface IShowUserInputDTO {
  show_id: string;
  user_id: string;
}

export interface IBookTicketInputDTO {
  showId: string;
  token: string;
}

export interface IDeleteReservationInputDTO {
  showId: string;
  token: string;
}

export class Ticket {
  constructor(
    private id: string,
    private showId: string,
    private userId: string
  ) {}

  public toIShowDBModel = (): ITicketDB => {
    return {
      id: this.id,
      show_id: this.showId,
      user_id: this.userId,
    };
  };

  public getId = () => this.id;

  public getShowId = () => this.showId;

  public getUserId = () => this.userId;
}
