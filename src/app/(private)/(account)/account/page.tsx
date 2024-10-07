'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  openingTime: z.string(),
  closingTime: z.string(),
  appointmentInterval: z.string(),
})

export type SchemaOrganizationSchedule = z.infer<typeof schema>

export default function Account() {
  const { register, handleSubmit } = useForm<SchemaOrganizationSchedule>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: SchemaOrganizationSchedule) => {}

  return (
    <main className='flex h-full w-full max-w-[690px] flex-col space-y-4'>
      <div className='flex flex-col border'>
        <div className='flex items-center justify-between space-x-4 p-4'>
          <div className='flex flex-col justify-between space-y-4'>
            <span>Avatar</span>
            <p className='text-wrap text-sm text-gray-500'>
              Este é seu avatar. Clique no avatar para carregar um personalizado
              dos seus arquivos.
            </p>
          </div>
          <div className='min-h-16 min-w-16 rounded-full border'></div>
        </div>
        <div className='flex items-center border-t p-4'>
          <p className='text-xs text-gray-500'>
            Um avatar é opcional, mas altamente recomendado.
          </p>
        </div>
      </div>
    </main>
  )
}
