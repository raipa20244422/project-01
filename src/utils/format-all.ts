export function formatPhone(value: string) {
  if (!value) return ''
  value = value.replace(/\D/g, '')
  value = value.replace(/(\d{2})(\d)/, '($1) $2')
  value = value.replace(/(\d)(\d{4})$/, '$1-$2')
  return value
}

export function formatCPFouCNPJ(value: string) {
  value = value.replace(/\D/g, '')

  if (value.length <= 11) {
    // CPF: 11 dígitos
    value = value.replace(/(\d{3})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  } else if (value.length <= 14) {
    // CNPJ: 14 dígitos
    value = value.replace(/(\d{2})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d{4})/, '$1/$2')
    value = value.replace(/(\d{4})(\d{2})$/, '$1-$2')
  }

  return value
}

export function formatCNPJ(value: string) {
  value = value.replace(/\D/g, '') // Remove todos os caracteres não numéricos
  value = value.replace(/^(\d{2})(\d)/, '$1.$2') // Coloca o primeiro ponto
  value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3') // Coloca o segundo ponto
  value = value.replace(/\.(\d{3})(\d)/, '.$1/$2') // Coloca a barra
  value = value.replace(/(\d{4})(\d)/, '$1-$2') // Coloca o hífen
  return value
}

export function formatCEP(value: string) {
  value = value.replace(/\D|-/g, '')
  value = value.replace(/(\d{5})(\d)/, '$1-$2')
  return value
}

export function formatDateString(dateString: string) {
  const date = new Date(dateString)
  const options = {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  } as const
  return date.toLocaleDateString('pt-BR', options)
}

export function formatTimeString(dateString: string) {
  const date = new Date(dateString)
  const options = {
    timeZone: 'America/Sao_Paulo',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  } as const
  return date.toLocaleTimeString('pt-BR', options)
}

export function extractNumbers(value: string) {
  return value.replace(/\D/g, '')
}

export function formatReal(value: number, sigla?: boolean): string {
  if (sigla) {
    return value.toLocaleString('pt-br')
  } else {
    return value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
  }
}

export function formatRealString(value: string) {
  const notNumbers = extractNumbers(value)
  return !isNaN(parseFloat(notNumbers))
    ? formatReal(parseFloat(notNumbers), true)
    : ''
}

export function formatarComoReais(input: string) {
  const valorString = extractNumbers(input)

  if (valorString === '') {
    return ''
  }

  const valorNumerico = parseInt(valorString, 10)

  if (isNaN(valorNumerico)) {
    return ''
  }

  const valorFormatado = (valorNumerico / 100).toFixed(2)

  return valorFormatado.replace('.', ',')
}

export function convertStringToNumber(str: string): number {
  if (typeof str !== 'string') return NaN

  const convertedStr = str.replace(',', '.')
  const number = parseFloat(convertedStr)

  // Verifica se a conversão foi bem-sucedida e formata para dois dígitos decimais
  return isNaN(number) ? NaN : parseFloat(number.toFixed(2))
}

export function formatDate(dateString: Date): string {
  const date = new Date(dateString)

  if (isNaN(date.getTime())) {
    throw new Error('Invalid Date')
  }

  return date.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatStatus(status: string): string {
  const statusMap: { [key: string]: string } = {
    pending: 'Pendente',
    accepted: 'Aceito',
    rejected: 'Rejeitado',
  }

  return statusMap[status] || status
}
