import { ButtonHTMLAttributes, ReactNode } from 'react'
import './styles.css'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ReactNode
  children?: ReactNode
}

export function Button({ icon, children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`button ${icon ? 'with-icon' : ''} ${props.className}`}
    >
      {children ?? icon}
    </button>
  )
}
