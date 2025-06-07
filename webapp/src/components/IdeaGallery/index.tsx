import { Box } from '@mantine/core'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import cn from 'classnames'
import React, { KeyboardEventHandler, MouseEventHandler } from 'react'
import ImageGallery, { ReactImageGalleryProps } from 'react-image-gallery'
import { getCloudinaryUploadUrl } from '../../lib/cloudinary'
import classes from './index.module.scss'

type IdeaGalleryProps = {
  images: string[]
}

type OriginalNavOnClick = MouseEventHandler<HTMLElement>

// Новый внутренний компонент для навигации
type CustomNavButtonProps = {
  direction: 'left' | 'right'
  onClick: OriginalNavOnClick
  disabled: boolean
}

const CustomNavButton = ({ direction, onClick, disabled }: CustomNavButtonProps) => {
  const IconComponent = direction === 'left' ? IconChevronLeft : IconChevronRight
  const directionClass = direction === 'left' ? classes.leftArea : classes.rightArea
  const ariaLabel = direction === 'left' ? 'Previous Slide' : 'Next Slide'

  const handleClick: MouseEventHandler<HTMLDivElement> = (event) => {
    if (!disabled) {
      onClick(event as React.MouseEvent<HTMLElement, MouseEvent>)
    }
  }

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (!disabled && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault()
      // Создаем безопасную заглушку для события, чтобы избежать ошибок
      const mouseEventStub = {
        preventDefault: () => { },
      } as React.MouseEvent<HTMLElement, MouseEvent>
      onClick(mouseEventStub)
    }
  }

  return (
    <div
      className={cn(classes.navClickArea, directionClass, { [classes.disabled]: disabled })}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel}
    >
      <div className={classes.navArrowContainer}>
        <IconComponent className={classes.navArrowIcon} size="2rem" aria-hidden="true" />
      </div>
    </div>
  )
}

export const IdeaGallery = ({ images }: IdeaGalleryProps) => {
  if (!images || images.length === 0) {
    return null
  }

  const renderLeftNav: ReactImageGalleryProps['renderLeftNav'] = (onClick, disabled) => {
    return <CustomNavButton direction="left" onClick={onClick as OriginalNavOnClick} disabled={disabled} />
  }

  const renderRightNav: ReactImageGalleryProps['renderRightNav'] = (onClick, disabled) => {
    return <CustomNavButton direction="right" onClick={onClick as OriginalNavOnClick} disabled={disabled} />
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
