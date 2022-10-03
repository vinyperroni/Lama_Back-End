export interface IShowDb {
  id: string;
  band: string;
  starts_at: Date;
  available_tickets?: number;
}

export interface IShowsOutput {
  band: string;
  startsAt: string;
  availableTickets: number;
}

export interface ICreateShowDTO {
  band: string;
  startsAt: string;
  token: string;
}

export class Show {
  constructor(
    private id: string,
    private band: string,
    private startsAt: Date,
    private availableTickets?: number
  ) {}

  public toIShowDBModel = (): IShowDb => {
    return {
      id: this.id,
      band: this.band,
      starts_at: this.startsAt,
    };
  };

  public getId = () => this.id;

  public getBand = () => this.band;

  public getStartsAt = () => this.startsAt;

  public getAvailableTickets = () => this.availableTickets;
}
