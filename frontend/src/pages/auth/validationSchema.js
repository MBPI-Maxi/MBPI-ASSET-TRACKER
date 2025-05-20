import { 
  object, 
  string, 
  number, 
  date, 
  boolean, 
  ref 
} from "yup";

export const registrationSchema = object({
  first_name: string().required("First name is required"),
  last_name: string().required("Last name is required"),
  username: string().required("Username is required"),
  email: string().email("Email is invalid").required("Email is required"),
  password: string().required("Password is required"),
  confirmPassword: string()
    .oneOf([ref("password")], "Password did not match")
    .required("Confirm password is required"),
});

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
    .required("Warranty expiry is required")
    .min(ref("purchased_date"), "Warranty expiry cannot be before purchased date"),

  location: string()
    .required("Location is required"),

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
})
