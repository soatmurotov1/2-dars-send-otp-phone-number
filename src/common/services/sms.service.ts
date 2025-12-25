import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { response } from 'express';

@Injectable()
export class SmsService {
  private token: string;
  private readonly $axios = axios.create({
    baseURL: "https://notify.eskiz.uz/api",
  })
  async sendSMS(message: string, phone: string) {
    try {
      if (!this.token) {
        await this.login()
      }
      await this.$axios.post(
        "/message/sms/send",
        {
          mobile_phone: phone,
          message: message,
          from: '4546'
        },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          }
        }
      )

      console.log(`SMS yuborildi: ${message} -> ${phone}`)
    } catch (error) {
      console.error('SMS yuborishda xatolik:', error)
    }
  }

  private async login() {
    try {
      const { data } = await this.$axios.post<{ data: { token: string } }>(
        '/auth/login',
        {
          email: process.env.SMS_LOGIN,
          password: process.env.SMS_PASSWORD
        }
      )
      this.token = data.data.token
    } catch (error) {
      console.error('SMS login xatolik:', error)
    }
  }
}