import { MaterialInterface } from "./MaterialInterface";
import { ProductionInterface } from "./ProductionInterface";

export interface FormulaInterface {
  id: number;
  name: string;
  material: MaterialInterface;
  qty: number;
  unit: string;
  production: ProductionInterface;
}
