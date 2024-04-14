"use server";

import * as zod from 'zod'

import prisma from "@/lib/db";
import bcrypt from 'bcryptjs'

import { LoginValidator, RegisterValidator } from "@/schema/auth";
import { cookies } from 'next/headers'
import { Send } from '@/lib/utils';

import { detectBrowser, detectOS } from "@/lib/detectUser";
import { redirect } from 'next/navigation';

export async function login(values: zod.infer<typeof LoginValidator>) {

  const user = await prisma.user.findFirst({
    where: { username: values.username }
  })
  if (user) {
    const comparePasswords = await bcrypt.compare(values.password, user.password)
    if (comparePasswords) {
      const token = await bcrypt.hash(String(user.id), 10)
      const newSession = await prisma.session.create({
        data: {
          client: values.client,
          browser: values.browser,
          token,
          userId: user.id
        }
      })
      cookies().set('social_token', token, {
        expires: new Date("2025-01-01")
      })
      return {
        message: 'User was found!',
        status: 200,
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          token
        },
      }
    } else {
      return {
        message: 'Invalid Username or Password!',
        status: 404,
        user: null,
      }
    }
  } else {
    return {
      message: 'Invalid Username or Password!',
      status: 404,
      user: null,
    }
  }
}

export async function register(values: zod.infer<typeof RegisterValidator>) {

  const { name, username, email, password } = values;
  
  const findByUsername = await prisma.user.findUnique({
    where: { username }
  })
  const findByEmail = await prisma.user.findUnique({
    where: { email }
  })

  if (findByUsername) {
    return Send.response(Send.codes.found, 'Username already exists!')
  }

  if (findByEmail) {
    return Send.response(Send.codes.found, 'E-mail address already exists!')
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      name,
      username,
      email,
      password: hashedPassword
    }
  })

  const token = await bcrypt.hash(String(user.id), 10)
  const newSession = await prisma.session.create({
    data: {
      client: values.client,
      browser: values.browser,
      token,
      userId: user.id
    }
  })

  cookies().set('social_token', token, {
    expires: new Date("2025-01-01")
  })

  redirect(`/profile/${username}`)

  return Send.response(
    Send.codes.created, 
    'Registered Successfully! Redirecting to profile...',
    {
      user,
      id: user.id,
      name: user.name,
      username: user.username,
      token
    }
  )
}

export async function resetPassword() {
  
}

export async function verifyEmail() {
  
}