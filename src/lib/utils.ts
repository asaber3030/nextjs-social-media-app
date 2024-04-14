import { type ClassValue, clsx } from "clsx"
import moment from "moment"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function showS(text: string, number: number) {
  return (number > 1) ? text + 's' : text
}

export function formatMoney(money: number, locales = 'en-IN', options = {
  style: 'currency',
  currency: 'EGP',
  maximumSignificantDigits: 5,
  minimumSignificantDigits: 3
}) {
  return new Intl.NumberFormat('en-IN', options).format(money)
}


export function formatNumber(num: number) {
  return Intl.NumberFormat().format(num)
}
export function formatDate(date: string | Date, format = {
  year: 'numeric',
  month: 'long', 
  day: 'numeric',
  hour: "numeric",
  minute: "numeric",
}) {
  return new Date(date).toLocaleDateString("en-US", format as any)
}

export function numberForUsers(number: number) {
  let options = {
    notation: "compact",
    compactDisplay: "short",
  };
  //@ts-ignore
  const usformatter = Intl.NumberFormat("en-US", options);
  return usformatter.format(number);
}

export function now(format: string = "MMMM Do YYYY, h:mm:ss a") {
  return moment().format(format)
}
 
export function response(status: number, message: string, data?: any) {
  return {
    status,
    message,
    data
  }
}

export class Send {
  static codes: Record<string, number> = {
    ok: 200,
    created: 201,
    found: 302,
    unauthorized: 401,
    forbidden: 403,
    notfound: 404,
    error: 500
  }
  static response(status: number, message: string, data?: any) {
    return {
      status,
      message,
      data
    }
  }
  static unauthorized() {
    return {
      status: Send.codes.unauthorized,
      message: 'Unauthorized',
    }
  }
}

export function dateForHuman(date: Date) {
  return moment(date).fromNow()
}