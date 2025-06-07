import { Loader as MantineLoader, Box, type LoaderProps, type BoxProps } from '@mantine/core'

type CustomLoaderProps = {
  type: 'page' | 'section'
  loaderProps?: Omit<LoaderProps, 'size'>
  containerProps?: BoxProps
}

export const Loader = ({ type, loaderProps, containerProps }: CustomLoaderProps) => {
  const mantineLoaderSize = type === 'page' ? 150 : 80

  const containerStyles: React.CSSProperties =
    type === 'page'
      ? {
          width: '100%',
          minHeight: `${mantineLoaderSize}px`,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }
      : {
          width: '100%',
          height: '100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }

  return (
    <Box {...containerProps} style={{ ...containerStyles, ...containerProps?.style }}>
      <MantineLoader type="dots" size={mantineLoaderSize} color="teal" {...loaderProps} />
    </Box>
  )
}
