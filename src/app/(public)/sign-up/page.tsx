'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronRight, LogIn } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { createAccountOrganization } from '@/actions/action-sign-up'
import { InputFormatter } from '@/components/input-formatter'
import { MessageError } from '@/components/message-erro'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { statesBrazil } from '@/data/states-brazil'
import { SignUpSchema, signUpSchema } from '@/lib/zod/sign-up-schema'
import { formatCPFouCNPJ, formatPhone } from '@/utils/format-all'

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
    if (message?.includes('e-mail already exists.')) {
      setError('email', { message: 'Email já esta em uso.' })
    }
    if (message?.includes('slug already exists.')) {
      setError('slug', { message: 'Slug já esta em uso.' })
    }
    if (code === 201) {
      router.push('/sign-in')
    }
  }

  const removeSpace = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value.replace(/\s/g, '')
  }

  const searchAddress = async (cep: string) => {
    if (cep.length === 8) {
      setLoading(true)
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
        const data = await response.json()

        if (data.erro) {
        } else {
          setValue('street', data.logradouro)
          setValue('neighborhood', data.bairro)
          setValue('city', data.localidade)
          setValue('state', data.uf)
        }
      } catch (error) {
        alert('Erro ao buscar o CEP.')
      } finally {
        setLoading(false)
      }
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

        {/* Slug */}
        <div className='flex w-full flex-col space-y-1'>
          <label className='text-xs text-gray-500'>Definir Apelido</label>
          <Input
            placeholder='Apelido da empresa'
            className='lowercase'
            {...register('slug')}
            onChange={removeSpace}
          />
          {errors.slug && <MessageError>{errors.slug.message}</MessageError>}
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

        {/* CPF */}
        <div className='flex w-full flex-col space-y-1'>
          <label className='text-xs text-gray-500'>CPF/CNPJ</label>
          <InputFormatter
            maskFunction={formatCPFouCNPJ}
            {...register('cpforcnpj')}
            inputComponent={
              <Input
                maxLength={18}
                placeholder='Seu CPF/CNPJ'
              />
            }
          />
          {errors.cpforcnpj && (
            <MessageError>{errors.cpforcnpj.message}</MessageError>
          )}
        </div>

        {/* Telefone */}
        <div className='flex w-full flex-col space-y-1'>
          <label className='text-xs text-gray-500'>Telefone</label>
          <InputFormatter
            maskFunction={formatPhone}
            {...register('phone')}
            inputComponent={
              <Input
                maxLength={15}
                placeholder='Telefone (com DDD)'
              />
            }
          />
          {errors.phone && <MessageError>{errors.phone.message}</MessageError>}
        </div>

        {/* Endereço */}
        <div className='grid grid-cols-1 gap-2 md:grid-cols-2'>
          {/* CEP */}
          <div className='flex w-full flex-col space-y-1'>
            <label className='text-xs text-gray-500'>CEP</label>
            <Input
              type='text'
              placeholder='CEP da empresa'
              maxLength={8}
              {...register('zipCode', {
                required: 'O CEP é obrigatório',
                pattern: {
                  value: /^[0-9]{8}$/,
                  message: 'Digite um CEP válido (apenas números)',
                },
              })}
              onChange={(e) => searchAddress(e.target.value)}
            />

            {errors.zipCode && (
              <MessageError>{errors.zipCode.message}</MessageError>
            )}
          </div>

          {/* Rua */}
          <div className='flex w-full flex-col space-y-1'>
            <label className='text-xs text-gray-500'>Rua</label>
            <Input
              placeholder='Rua da empresa'
              {...register('street')}
              disabled={isLoading}
            />
            {errors.street && (
              <MessageError>{errors.street.message}</MessageError>
            )}
          </div>

          {/* Bairro */}
          <div className='flex w-full flex-col space-y-1'>
            <label className='text-xs text-gray-500'>Bairro</label>
            <Input
              placeholder='Bairro da empresa'
              {...register('neighborhood')}
              disabled={isLoading}
            />
            {errors.neighborhood && (
              <MessageError>{errors.neighborhood.message}</MessageError>
            )}
          </div>

          {/* Estado */}
          <div className='flex w-full flex-col space-y-1'>
            <label className='text-xs text-gray-500'>Estado</label>

            <Controller
              control={control}
              name='state'
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Select
                  onValueChange={onChange}
                  value={value}
                  disabled={isLoading}
                >
                  <SelectTrigger className='w-full text-gray-500'>
                    <SelectValue placeholder='Estado' />
                  </SelectTrigger>
                  <SelectContent>
                    {statesBrazil.map((current) => (
                      <SelectItem
                        key={current.uf}
                        value={current.uf}
                        className='capitalize'
                      >
                        {current.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            {errors.state && (
              <MessageError>{errors.state.message}</MessageError>
            )}
          </div>

          {/* Cidade */}
          <div className='flex w-full flex-col space-y-1'>
            <label className='text-xs text-gray-500'>Cidade</label>
            <Input
              placeholder='Cidade da empresa'
              {...register('city')}
              disabled={isLoading}
            />
            {errors.city && <MessageError>{errors.city.message}</MessageError>}
          </div>

          {/* Número */}
          <div className='flex w-full flex-col space-y-1'>
            <label className='text-xs text-gray-500'>Número</label>
            <Input
              placeholder='Número da empresa'
              {...register('number')}
              disabled={isLoading}
            />

            {errors.number && (
              <MessageError>{errors.number.message}</MessageError>
            )}
          </div>
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
