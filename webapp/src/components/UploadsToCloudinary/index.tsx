import { type CloudinaryUploadPresetName, type CloudinaryUploadTypeName } from '@brightideas/shared'
import { FileInput, SimpleGrid, Image, ActionIcon, Box, Stack } from '@mantine/core'
import { IconUpload } from '@tabler/icons-react'
import { type FormikProps } from 'formik'
import { useState } from 'react'
import { getCloudinaryUploadUrl } from '../../lib/cloudinary'
import { Icon } from '../Icon'
import { useUploadToCloudinary } from '../UploadToCloudinary'

export const UploadsToCloudinary = <TTypeName extends CloudinaryUploadTypeName>({
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
  const value = (formik.values[name] as string[]) || []
  const error = formik.touched[name] && formik.errors[name] ? (formik.errors[name] as string) : undefined
  const disabled = formik.isSubmitting

  const [selectedFiles, setSelectedFiles] = useState<File[] | undefined>(undefined)
  const [loading, setLoading] = useState(false)

  const { uploadToCloudinary } = useUploadToCloudinary(type)

  const handleFileChange = async (files: File[] | null) => {
    if (!files || files.length === 0) {
      setSelectedFiles(undefined)
      return
    }

    setSelectedFiles(files)
    setLoading(true)
    const currentValues = (formik.values[name] as string[]) || []
    const newValue = [...currentValues]

    try {
      await Promise.all(
        files.map(async (file) => {
          const { publicId } = await uploadToCloudinary(file)
          if (!currentValues.includes(publicId) && !newValue.includes(publicId)) {
            newValue.push(publicId)
          }
        })
      )
      formik.setFieldValue(name, newValue)
    } catch (err: any) {
      console.error(err)
      formik.setFieldError(name, err.message)
    } finally {
      formik.setFieldTouched(name, true, false)
      setLoading(false)
      setSelectedFiles(undefined)
    }
  }

  const handleRemoveImage = (publicIdToRemove: string) => {
    const currentValues = (formik.values[name] as string[]) || []
    formik.setFieldValue(
      name,
      currentValues.filter((publicId) => publicId !== publicIdToRemove)
    )
    formik.setFieldTouched(name, true)
  }

  return (
    <Stack>
      <FileInput
        label={label}
        placeholder={value.length ? 'Upload more...' : 'Pick images or drop here'}
        multiple
        accept="image/*"
        value={selectedFiles}
        onChange={handleFileChange}
        error={error}
        disabled={loading || disabled}
        clearable
        leftSection={<IconUpload size=".9rem" stroke={1.5} />}
        radius="md"
      />

      {value.length > 0 && (
        <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="sm" mt="sm">
          {value.map((publicId) => (
            <Box key={publicId} pos="relative">
              <ActionIcon
                variant="light"
                color="red"
                radius="md"
                size="sm"
                pos="absolute"
                top={4}
                right={4}
                style={{ zIndex: 1 }}
                onClick={() => handleRemoveImage(publicId)}
                disabled={loading || disabled}
                aria-label={`Remove image ${publicId}`}
              >
                <Icon name="delete" size={14} />
              </ActionIcon>
              <Image
                src={getCloudinaryUploadUrl(publicId, type, preset)}
                alt={`Uploaded image ${publicId}`}
                height={100}
                fit="cover"
                radius="md"
                style={{ opacity: loading ? 0.5 : 1 }}
              />
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Stack>
  )
}
