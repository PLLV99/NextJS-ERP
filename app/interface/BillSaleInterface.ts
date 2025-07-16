import { UserInterface } from "./UserInterface";

export interface BillSaleInterface {
  id: number;
  User: UserInterface;
  inputMoney: number;
  discount: number;
  status: string;
  createdAt: Date;
}
