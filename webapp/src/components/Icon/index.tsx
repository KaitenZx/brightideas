import { IconCircleX, IconHeart, IconHeartFilled } from '@tabler/icons-react'
import { createElement, SVGAttributes } from 'react'

const icons = {
  likeEmpty: IconHeart,
  likeFilled: IconHeartFilled,
  delete: IconCircleX,
}

type IconProps = {
  name: keyof typeof icons
  size?: string | number
} & Omit<SVGAttributes<SVGSVGElement>, 'size'>

export const Icon = ({ name, size, ...restProps }: IconProps) => {
  return createElement(icons[name], { size, ...restProps })
}
