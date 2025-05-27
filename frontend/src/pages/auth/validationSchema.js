import { 
  object, 
  string, 
  number, 
  date, 
  boolean, 
  ref 
} from "yup";

import { DEPARTMENT_LIST, LOCATION_LIST } from "@/constants/backendData";

export const registrationSchema = object({
  first_name: string().required("First name is required"),
  last_name: string().required("Last name is required"),
  username: string().required("Username is required"),
  email: string().email("Email is invalid").required("Email is required"),
  department: string().required("Department is required"),
  password: string().required("Password is required"),
  confirmPassword: string()
    .oneOf([ref("password")], "Password did not match")
    .required("Confirm password is required"),
});

export const loginSchema = object({
  username: string().required("Username is required"),
  password: string().required("Password is required"),
})

export const addAssetSchema = object({
  item_name: string()
    .required("Item name is required"),

  department: string()
    .required("Department is required"),

  amount_purchased: number()
    .typeError("Amount must be a number")
    .min(0, "Amount must be positive")
    .required("Amount is required"),

  purchased_date: date()
    .typeError("Purchased date is invalid")
    .required("Purchased date is required"),

  warranty_expiry: date()
    .typeError("Warranty expiry is invalid")
    // .required("Warranty expiry is required")
    .min(ref("purchased_date"), "Warranty expiry cannot be before purchased date"),

  location: string()
    .required("Location is required")
    .oneOf(LOCATION_LIST, "Invalid Location"),

  vendor: string()
    .nullable(),

  remarks: string()
    .nullable(),

  is_active: boolean()
    .required(),

  is_found: boolean()
    .required(),
});

export const updateAssetSchema = object({
  item_name: string()
    .required("Item is required"),

  department: string()
    .required("department is required")
    .oneOf(DEPARTMENT_LIST, "Invalid Department")
})

export const maintenanceSchema = object({
  service_type: string()
    .required("Service type is required"),

  asset: number()
    .typeError("Asset ID must be a number")
    .min(1, "Asset ID must be a valid number")
    .required("Asset is required"),

  service_date: date()
    .typeError("Service date is invalid")
    .required("Service date is required"),

  cost: number()
    .typeError("Cost must be a number")
    .min(0, "Cost must be at least 0")
    .required("Cost is required"),

  // status: boolean()
  //   .required("Status is required")
})