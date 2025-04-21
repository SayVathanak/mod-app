// components/ui/Card.tsx
import { Box, BoxProps } from '@chakra-ui/react'
import { ReactNode } from 'react'

interface CardProps extends BoxProps {
  children: ReactNode
  isHoverable?: boolean
}

export const Card = ({ children, isHoverable = false, ...props }: CardProps) => {
  return (
    <Box
      bg="white"
      borderRadius="lg"
      p={4}
      shadow="sm"
      transition="all 0.2s"
      className={`${isHoverable ? 'hover:shadow-md hover:-translate-y-1' : ''}`}
      {...props}
    >
      {children}
    </Box>
  )
}