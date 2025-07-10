import { ProductionInterface } from "./ProductionInterface";
import { StoreInterface } from "./StoreInterface";

export interface StoreImportInterface {
  id: number; // Unique identifier for the store import
  store: StoreInterface; // Store where the import is made
  production: ProductionInterface; // Production associated with the import
  qty: number; // Quantity of material being imported
  remark: string; // Additional remarks or notes about the import
  importDate: string; // Date of the import in ISO format
}
