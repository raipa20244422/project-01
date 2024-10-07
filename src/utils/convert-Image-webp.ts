import { PutObjectCommand } from '@aws-sdk/client-s3'

import { s3Client } from '@/lib/bucket'

export async function convertAndUploadImageToWebP(
  file: File,
  bucketName: string,
  folderPath: string,
): Promise<string | null> {
  if (file.type === 'image/png' || file.type === 'image/jpeg') {
    // Converte a imagem para WebP
    const bitmap = await createImageBitmap(file)
    const canvas = document.createElement('canvas')
    canvas.width = bitmap.width
    canvas.height = bitmap.height
    const ctx = canvas.getContext('2d')

    if (ctx) {
      ctx.drawImage(bitmap, 0, 0)
      const webpDataUrl = canvas.toDataURL('image/webp')

      // Convertendo o Data URL para um Blob para o upload
      const response = await fetch(webpDataUrl)
      const webpBlob = await response.blob()

      // Criação de uma chave única para a imagem no S3
      const uniqueFileName = `${folderPath}/${Date.now()}.webp`

      // Fazendo o upload para o S3
      try {
        const s3Response = await uploadFileToS3(
          webpBlob,
          bucketName,
          uniqueFileName,
        )
        return s3Response // Retorna a URL da imagem
      } catch (err) {
        return null
      }
    }
  }
  return null
}

// Função de upload para o S3, recebendo o arquivo já convertido em Blob
async function uploadFileToS3(
  file: Blob,
  bucketName: string,
  key: string,
): Promise<string | null> {
  // Parâmetros de upload
  const uploadParams = {
    Bucket: bucketName,
    Key: key,
    Body: file,
    ContentType: 'image/webp',
  }

  try {
    // Faz o upload
    const data = await s3Client.send(new PutObjectCommand(uploadParams))

    // Retorna a URL da imagem
    const imageUrl = `https://${bucketName}.s3.amazonaws.com/${key}`
    return imageUrl
  } catch (err) {
    return null
  }
}
