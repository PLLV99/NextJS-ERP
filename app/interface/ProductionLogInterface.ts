import { ProductionInterface } from "./ProductionInterface";

export interface ProductionLogInterface {
  id: number;
  production: ProductionInterface;
  qty: number;
  unit: string;
  createdAt: Date;
  remark: string;
}
