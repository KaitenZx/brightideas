import { Box } from '@mantine/core'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import cn from 'classnames'
import React, { KeyboardEventHandler, MouseEventHandler } from 'react' // Импортируем типы обработчиков
import ImageGallery, { ReactImageGalleryProps } from 'react-image-gallery'
import { getCloudinaryUploadUrl } from '../../lib/cloudinary'
import classes from './index.module.scss'

type IdeaGalleryProps = {
  images: string[]
}

// Определяем тип для onClick, который приходит из react-image-gallery
// Согласно ошибке, это React.MouseEventHandler<HTMLElement>
type OriginalNavOnClick = React.MouseEventHandler<HTMLElement>

export const IdeaGallery = ({ images }: IdeaGalleryProps) => {
  if (!images || images.length === 0) {
    return null
  }

  // --- Общая логика для обработчиков навигации ---
  const createNavHandler = (
    originalOnClick: OriginalNavOnClick, // Используем точный тип
    disabled: boolean
  ): { handleClick: MouseEventHandler<HTMLDivElement>; handleKeyDown: KeyboardEventHandler<HTMLDivElement> } => {
    // Обработчик клика (просто вызывает оригинальный обработчик)
    const handleClick: MouseEventHandler<HTMLDivElement> = (event) => {
      if (!disabled) {
        // Передаем оригинальное событие, но приводим тип, если нужно
        // (хотя HTMLElement совместим с HTMLDivElement для целей события)
        originalOnClick(event as React.MouseEvent<HTMLElement, MouseEvent>)
      }
    }

    // Обработчик нажатия клавиши
    const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
      if (!disabled && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault() // Предотвращаем прокрутку для Space

        // === ИСПРАВЛЕНИЕ ===
        // Вызываем оригинальный onClick, но НЕ передаем KeyboardEvent.
        // Передаем фиктивное событие MouseEvent или null/undefined,
        // чтобы удовлетворить типизацию onClick.
        // Передача фиктивного пустого объекта, приведенного к типу, самый надежный способ.
        originalOnClick({} as React.MouseEvent<HTMLElement, MouseEvent>)
        // Или, если библиотека допускает, можно попробовать:
        // originalOnClick(null as any);
        // Или даже вызвать без аргументов, но это менее надежно с точки зрения типов.
        // originalOnClick();
      }
    }

    return { handleClick, handleKeyDown }
  }

  // --- Реализация renderLeftNav ---
  const renderLeftNav: ReactImageGalleryProps['renderLeftNav'] = (onClick, disabled) => {
    // Убедимся, что onClick соответствует ожидаемому типу
    const { handleClick, handleKeyDown } = createNavHandler(onClick as OriginalNavOnClick, disabled)

    return (
      <div
        className={cn(classes.navClickArea, classes.leftArea, { [classes.disabled]: disabled })}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-label="Previous Slide"
        // aria-disabled={disabled}
      >
        {!disabled && (
          <div className={classes.navArrowContainer}>
            <IconChevronLeft className={classes.navArrowIcon} size="2rem" aria-hidden="true" />
          </div>
        )}
      </div>
    )
  }

  // --- Реализация renderRightNav ---
  const renderRightNav: ReactImageGalleryProps['renderRightNav'] = (onClick, disabled) => {
    // Убедимся, что onClick соответствует ожидаемому типу
    const { handleClick, handleKeyDown } = createNavHandler(onClick as OriginalNavOnClick, disabled)

    return (
      <div
        className={cn(classes.navClickArea, classes.rightArea, { [classes.disabled]: disabled })}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-label="Next Slide"
        // aria-disabled={disabled}
      >
        {!disabled && (
          <div className={classes.navArrowContainer}>
            <IconChevronRight className={classes.navArrowIcon} size="2rem" aria-hidden="true" />
          </div>
        )}
      </div>
    )
  }

  const galleryItems = images.map((image) => ({
    original: getCloudinaryUploadUrl(image, 'image', 'large'),
    thumbnail: getCloudinaryUploadUrl(image, 'image', 'preview'),
    originalAlt: `Idea image ${image}`,
    thumbnailAlt: `Idea image thumbnail ${image}`,
  }))

  return (
    <Box className={classes.imageGalleryWrapper} style={{ position: 'relative' }}>
      <ImageGallery
        items={galleryItems}
        showPlayButton={false}
        showFullscreenButton={false}
        showThumbnails={images.length > 1}
        thumbnailPosition="bottom"
        renderLeftNav={renderLeftNav}
        renderRightNav={renderRightNav}
        lazyLoad={true}
        useBrowserFullscreen={true}
        slideDuration={450}
        preventDefaultTouchmoveEvent={true}
      />
    </Box>
  )
}
