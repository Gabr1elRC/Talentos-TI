import type {
  ReactNode,
} from 'react'

import '../styles/Card.css'

type CardProps = {
  children: ReactNode
  className?: string
}

function Card({
  children,
  className = '',
}: CardProps) {
  return (
    <div
      className={`app-card ${className}`}
    >
      {children}
    </div>
  )
}

export default Card