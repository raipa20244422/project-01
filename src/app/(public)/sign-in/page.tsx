'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ChartNoAxesCombined, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { signInWithCredentials } from '@/actions/action-sign-in'
import { MessageError } from '@/components/message-erro'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'
import { SignInSchema, signInSchema } from '@/lib/zod/sign-in-schema'

export default function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
  })
  const router = useRouter()

  const onSubmit = async (data: SignInSchema) => {
    const { code, error } = await signInWithCredentials(data)

    if (code !== 200) {
      return toast({
        title: 'Email ou senha incorreto.',
      })
    }

    router.push('/')
  }

  return (
    <div className='flex flex-col space-y-4'>
      <p className='my-5 text-xl font-semibold text-primary'>
        Acesse sua conta
      </p>
      <form
        className='flex w-full flex-col space-y-3'
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className='flex w-full flex-col space-y-1'>
          <label className='text-xs text-gray-500'>Email</label>
          <Input
            placeholder='Email da empresa'
            type='email'
            {...register('email')}
          />
          {errors.email && <MessageError>{errors.email.message}</MessageError>}
        </div>

        <div>
          <div className='flex w-full flex-col space-y-1'>
            <label className='text-xs text-gray-500'>Senha</label>
            <Input
              placeholder='Senha'
              type='password'
              {...register('password')}
              autoComplete='current-password'
            />
            {errors.password && (
              <MessageError>{errors.password.message}</MessageError>
            )}
          </div>
          <Link
            href={''}
            className='text-sm text-blue-500'
          >
            Esqueceu a senha ?
          </Link>
        </div>

        <Button
          disabled={isLoading}
          type='submit'
        >
          Entrar
        </Button>
      </form>
      <Link
        href={'sign-up'}
        className='flex items-center justify-between rounded-lg border bg-gray-50 p-4 hover:bg-gray-100'
      >
        <div className='flex space-x-4'>
          <div className='flex items-center justify-center'>
            <ChartNoAxesCombined className='h-6 w-6 text-gray-500' />
          </div>
          <div className='flex flex-col text-gray-500'>
            <p className='text-base text-gray-500'>Não tem uma conta ?</p>
            <p className='text-sm text-primary'>Se inscreva gratuitamente</p>
          </div>
        </div>

        <div className='flex items-center justify-center'>
          <ChevronRight className='h-5 w-5 text-gray-500' />
        </div>
      </Link>
    </div>
  )
}
