import { type CloudinaryUploadPresetName, type CloudinaryUploadTypeName } from '@brightideas/shared'
import { FileInput, Image, Stack, Box, LoadingOverlay } from '@mantine/core'
import { IconUpload } from '@tabler/icons-react'
import { type FormikProps } from 'formik'
import memoize from 'lodash/memoize'
import { useCallback, useState } from 'react'
import { getCloudinaryUploadUrl } from '../../lib/cloudinary'
import { trpc } from '../../lib/trpc'
import { Button } from '../Button'

export const useUploadToCloudinary = (type: CloudinaryUploadTypeName) => {
  const prepareCloudinaryUpload = trpc.prepareCloudinaryUpload.useMutation()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getPreparedData = useCallback(
    memoize(
      async () => {
        const { preparedData } = await prepareCloudinaryUpload.mutateAsync({ type })
        return preparedData
      },
      () => JSON.stringify({ type, minutes: new Date().getMinutes() })
    ),
    [type]
  )

  const uploadToCloudinary = async (file: File) => {
    const preparedData = await getPreparedData()

    const formData = new FormData()
    formData.append('file', file)
    formData.append('timestamp', preparedData.timestamp)
    formData.append('folder', preparedData.folder)
    formData.append('transformation', preparedData.transformation)
    formData.append('eager', preparedData.eager)
    formData.append('signature', preparedData.signature)
    formData.append('api_key', preparedData.apiKey)

    return await fetch(preparedData.url, {
      method: 'POST',
      body: formData,
    })
      .then(async (rawRes) => {
        return await rawRes.json()
      })
      .then((res) => {
        if (res.error) {
          throw new Error(res.error.message)
        }
        return {
          publicId: res.public_id as string,
          res,
        }
      })
  }

  return { uploadToCloudinary }
}

export const UploadToCloudinary = <TTypeName extends CloudinaryUploadTypeName>({
  label,
  name,
  formik,
  type,
  preset,
}: {
  label: string
  name: string
  formik: FormikProps<any>
  type: TTypeName
  preset: CloudinaryUploadPresetName<TTypeName>
}) => {
  const value = formik.values[name] as string | undefined
  const error = formik.touched[name] && formik.errors[name] ? (formik.errors[name] as string) : undefined
  const disabled = formik.isSubmitting

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const { uploadToCloudinary } = useUploadToCloudinary(type)

  const handleFileChange = async (file: File | null) => {
    if (!file) {
      setSelectedFile(null)
      return
    }

    setSelectedFile(file)
    setLoading(true)

    try {
      const { publicId } = await uploadToCloudinary(file)
      formik.setFieldValue(name, publicId)
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

  const handleRemoveImage = () => {
    formik.setFieldValue(name, undefined)
    formik.setFieldError(name, undefined)
    formik.setFieldTouched(name, true)
  }

  return (
    <Stack>
      <FileInput
        label={label}
        placeholder={value ? 'Replace image...' : 'Pick image or drop here'}
        accept="image/*"
        value={selectedFile}
        onChange={handleFileChange}
        error={error}
        disabled={loading || disabled}
        clearable
        leftSection={<IconUpload size=".9rem" stroke={1.5} />}
        radius="md"
      />

      {value && (
        <Box w={120} h={120} pos="relative">
          <LoadingOverlay visible={loading} zIndex={1} overlayProps={{ radius: 'md', blur: 1 }} />
          <Image
            src={getCloudinaryUploadUrl(value, type, preset)}
            alt="Uploaded image preview"
            width={120}
            height={120}
            fit="contain"
            radius="md"
          />
        </Box>
      )}

      {value && !loading && (
        <Button variant="light" color="red" onClick={handleRemoveImage} disabled={disabled}>
          Remove
        </Button>
      )}
    </Stack>
  )
}
