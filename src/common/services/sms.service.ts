import { Injectable } from "@nestjs/common";
import axios from "axios";


@Injectable()
export class smsService {
    private token: string
    private readonly $axios = axios.create({
        
    })
}