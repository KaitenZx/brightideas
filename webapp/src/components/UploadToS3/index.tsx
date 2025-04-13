import { FileInput, Stack, Anchor, Box, LoadingOverlay } from '@mantine/core'
import { type FormikProps } from 'formik'
import { useState } from 'react'
import { getS3UploadName, getS3UploadUrl } from '../../lib/s3'
import { trpc } from '../../lib/trpc'
import { Button } from '../Button'

export const useUploadToS3 = () => {
  const prepareS3Upload = trpc.prepareS3Upload.useMutation()

  const uploadToS3 = async (file: File) => {
    const { signedUrl, s3Key } = await prepareS3Upload.mutateAsync({
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    })

    return await fetch(signedUrl, {
      method: 'PUT',
      body: file,
    }).then(async (rawRes) => {
      if (!rawRes.ok) {
        const errorText = await rawRes.text()
        throw new Error(`S3 upload failed: ${rawRes.status} ${errorText}`)
      }
      return { s3Key }
    })
  }

  return { uploadToS3 }
}

export const UploadToS3 = ({ label, name, formik }: { label: string; name: string; formik: FormikProps<any> }) => {
  const value = formik.values[name] as string | undefined
  const error = formik.touched[name] && formik.errors[name] ? (formik.errors[name] as string) : undefined
  const disabled = formik.isSubmitting

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const { uploadToS3 } = useUploadToS3()

  const handleFileChange = async (file: File | null) => {
    if (!file) {
      setSelectedFile(null)
      return
    }

    setSelectedFile(file)
    setLoading(true)

    try {
      const { s3Key } = await uploadToS3(file)
      formik.setFieldValue(name, s3Key)
    } catch (err: any) {
      console.error(err)
      formik.setFieldError(name, err.message)
      formik.setFieldValue(name, undefined)
    } finally {
      formik.setFieldTouched(name, true, false)
      setLoading(false)
      setSelectedFile(null)
    }
  }

  const handleRemoveFile = () => {
    formik.setFieldValue(name, undefined)
    formik.setFieldError(name, undefined)
    formik.setFieldTouched(name, true)
  }

  return (
    <Stack>
      <Box pos="relative">
        <LoadingOverlay visible={loading} zIndex={1} overlayProps={{ radius: 'sm', blur: 1 }} />
        <FileInput
          label={label}
          placeholder={value ? 'Replace file...' : 'Pick file or drop here'}
          accept="*"
          value={selectedFile}
          onChange={handleFileChange}
          error={error}
          disabled={loading || disabled}
          clearable
        />
      </Box>

      {value && !loading && (
        <Anchor href={getS3UploadUrl(value)} target="_blank" size="sm" mt="xs">
          {getS3UploadName(value)}
        </Anchor>
      )}

      {value && !loading && (
        <Button color="red" onClick={handleRemoveFile} disabled={disabled}>
          Remove
        </Button>
      )}
    </Stack>
  )
}
