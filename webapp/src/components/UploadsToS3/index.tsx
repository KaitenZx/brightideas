import { FileInput, Stack, Anchor, ActionIcon, Group, Box, LoadingOverlay } from '@mantine/core'
import { IconUpload } from '@tabler/icons-react'
import { type FormikProps } from 'formik'
import { useState } from 'react'
import { getS3UploadName, getS3UploadUrl } from '../../lib/s3'
import { Icon } from '../Icon'
import { useUploadToS3 } from '../UploadToS3'

export const UploadsToS3 = ({ label, name, formik }: { label: string; name: string; formik: FormikProps<any> }) => {
  const value = (formik.values[name] as string[]) || []
  const error = formik.touched[name] && formik.errors[name] ? (formik.errors[name] as string) : undefined
  const disabled = formik.isSubmitting

  const [selectedFiles, setSelectedFiles] = useState<File[] | undefined>(undefined)
  const [loading, setLoading] = useState(false)

  const { uploadToS3 } = useUploadToS3()

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
          const { s3Key } = await uploadToS3(file)
          if (!currentValues.includes(s3Key) && !newValue.includes(s3Key)) {
            newValue.push(s3Key)
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

  const handleRemoveFile = (s3KeyToRemove: string) => {
    const currentValues = (formik.values[name] as string[]) || []
    formik.setFieldValue(
      name,
      currentValues.filter((s3Key) => s3Key !== s3KeyToRemove)
    )
    formik.setFieldTouched(name, true)
  }

  return (
    <Stack>
      <Box pos="relative">
        <LoadingOverlay visible={loading} zIndex={1} overlayProps={{ radius: 'md', blur: 1 }} />
        <FileInput
          label={label}
          placeholder={value.length ? 'Upload more...' : 'Pick files or drop here'}
          multiple
          accept="*"
          value={selectedFiles}
          onChange={handleFileChange}
          error={error}
          disabled={loading || disabled}
          clearable
          leftSection={<IconUpload size=".9rem" stroke={1.5} />}
          radius="md"
        />
      </Box>

      {value.length > 0 && (
        <Stack gap="xs" mt="sm">
          {value.map((s3Key) => (
            <Group key={s3Key} gap="xs" justify="space-between">
              <Anchor
                href={getS3UploadUrl(s3Key)}
                target="_blank"
                size="sm"
                style={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              >
                {getS3UploadName(s3Key)}
              </Anchor>
              <ActionIcon
                variant="subtle"
                color="red"
                radius="md"
                size="sm"
                onClick={() => handleRemoveFile(s3Key)}
                disabled={loading || disabled}
                aria-label={`Remove file ${getS3UploadName(s3Key)}`}
              >
                <Icon name="delete" size={16} />
              </ActionIcon>
            </Group>
          ))}
        </Stack>
      )}
    </Stack>
  )
}
