import { IShowDb } from "../../models/Show";
import { IUserDB, USER_ROLES } from "../../models/User";
import { HashManager } from "../../services/HashManager";
import { IdGenerator } from "../../services/IdGenerator";

const idGenerator = new IdGenerator();
const hashManager = new HashManager();

const generatePassword = async (password: string): Promise<string> => {
  const hash = await hashManager.hash(password);
  return hash;
};

export const users: IUserDB[] = [
  {
    id: idGenerator.generate(),
    name: "Jhon Fox",
    email: "jhonfox@gmail.com",
    password: "senha-padrao-123456",
    role: USER_ROLES.NORMAL,
  },
  {
    id: idGenerator.generate(),
    name: "Carla Monterey",
    email: "carlamonterey@gmail.com",
    password: "senha-padrao-123456",
    role: USER_ROLES.ADMIN,
  },
  {
    id: idGenerator.generate(),
    name: "Lara Jamie",
    email: "larajamei@gmail.com",
    password: "senha-padrao-123456",
    role: USER_ROLES.NORMAL,
  },
  {
    id: idGenerator.generate(),
    name: "Vinicius Sparkle",
    email: "viniciussparkle@gmail.com",
    password: "senha-padrao-123456",
    role: USER_ROLES.ADMIN,
  },
];

export const shows: IShowDb[] = [
  {
    id: idGenerator.generate(),
    band: "Irmãos do Pop",
    starts_at: new Date("2022/12/25"),
  },
  {
    id: idGenerator.generate(),
    band: "Rony Pop",
    starts_at: new Date("2022/12/28"),
  },
  {
    id: idGenerator.generate(),
    band: "Waltinho",
    starts_at: new Date("2022/12/30"),
  },
  {
    id: idGenerator.generate(),
    band: "Pedrinho Jogação",
    starts_at: new Date("2022/12/31"),
  },
];
