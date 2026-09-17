import { DefaultDto } from "./default-dto";

export interface Token extends DefaultDto{
    email: string;
    token: string;
}