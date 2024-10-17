'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronRight, LogIn } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { createAccountOrganization } from '@/actions/action-sign-up'
import { MessageError } from '@/components/message-erro'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SignUpSchema, signUpSchema } from '@/lib/zod/sign-up-schema'

export default function SignUp() {
  const [isLoading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    setError,
    control,
    setValue,
    formState: { errors },
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
  })

  const router = useRouter()

  const onSubmit = async (data: SignUpSchema) => {
    const { code, message } = await createAccountOrganization(data)

    console.log(message)
    if (message?.includes('e-mail already exists.')) {
      setError('email', { message: 'Email já esta em uso.' })
    }
    if (code === 201) {
      router.push('/sign-in')
    }
  }

  return (
    <div className='flex flex-col space-y-4'>
      <p className='my-5 text-xl font-semibold text-primary'>
        Cadastre-se gratuitamente
      </p>
      <form
        className='flex w-full flex-col space-y-2'
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Nome da Empresa */}
        <div className='flex w-full flex-col space-y-1'>
          <label className='text-xs text-gray-500'>Empresa</label>
          <Input
            placeholder='Nome da empresa'
            {...register('name')}
          />
          {errors.name && <MessageError>{errors.name.message}</MessageError>}
        </div>

        {/* Email */}
        <div className='flex w-full flex-col space-y-1'>
          <label className='text-xs text-gray-500'>Email</label>
          <Input
            placeholder='Email da empresa'
            type='email'
            {...register('email')}
          />
          {errors.email && <MessageError>{errors.email.message}</MessageError>}
        </div>

        {/* Senha */}
        <div className='flex w-full flex-col space-y-1'>
          <label className='text-xs text-gray-500'>Senha</label>
          <Input
            placeholder='Senha'
            type='password'
            {...register('password')}
          />
          {errors.password && (
            <MessageError>{errors.password.message}</MessageError>
          )}
        </div>

        {/* Confirmar Senha */}
        <div className='flex w-full flex-col space-y-1'>
          <label className='text-xs text-gray-500'>Confirmar Senha</label>
          <Input
            placeholder='Confirme a senha'
            type='password'
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <MessageError>{errors.confirmPassword.message}</MessageError>
          )}
        </div>

        {/* Botão de Cadastro */}
        <Button type='submit'>Cadastrar</Button>
      </form>

      <Link
        href={'sign-in'}
        className='flex items-center justify-between rounded-lg border bg-gray-50 p-4 hover:bg-gray-100'
      >
        <div className='flex space-x-4'>
          <div className='flex items-center justify-center'>
            <LogIn className='h-6 w-6 text-gray-500' />
          </div>
          <div className='flex flex-col text-gray-500'>
            <p className='text-base text-gray-500'>Já tem uma conta ?</p>
            <p className='text-sm text-primary'>Entre na plataforma</p>
          </div>
        </div>

        <div className='flex items-center justify-center'>
          <ChevronRight className='h-5 w-5 text-gray-500' />
        </div>
      </Link>
    </div>
  )
}
