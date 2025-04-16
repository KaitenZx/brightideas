import {
  Loader as MantineLoader,
  Box,
  type LoaderProps, // Типы для Mantine Loader
  type BoxProps, // Типы для Box
} from '@mantine/core'

type CustomLoaderProps = {
  type: 'page' | 'section'
  loaderProps?: Omit<LoaderProps, 'size'> // Убираем 'size' из передаваемых пропсов MantineLoader
  containerProps?: BoxProps
}

export const Loader = ({ type, loaderProps, containerProps }: CustomLoaderProps) => {
  const mantineLoaderSize = type === 'page' ? 150 : 80

  const containerStyles: React.CSSProperties =
    type === 'page'
      ? {
          width: '100%',
          minHeight: `${mantineLoaderSize}px`, // Используем размер лоадера
          height: '100%', // Пытается занять всю высоту родителя
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
      <MantineLoader
        type="dots"
        size={mantineLoaderSize} // Передаем числовой размер
        color="teal"
        {...loaderProps} // Передаем остальные пропсы, кроме size
      />
    </Box>
  )
}
