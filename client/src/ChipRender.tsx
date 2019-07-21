import React, { ReactNode } from 'react'
import { Chip, displayColor } from '../chips'

type BorderProps = {
  color: string
  width: number
  style?: string
}

const ContainerCircle = ({
  color,
  width,
  style,
  children,
}: BorderProps & {
  children: ReactNode
}) => (
  <div
    style={{
      borderRadius: '55%',
      borderWidth: width,
      borderStyle: style || 'solid',
      borderColor: color,
      backgroundColor: 'black',
    }}
  >
    {children}
  </div>
)

const MultiCircle = ({
  list,
  children,
}: {
  list: BorderProps[]
  children: ReactNode
}) => {
  const [borderProps, ...rest] = list
  return (
    <ContainerCircle {...borderProps}>
      {rest.length ? (
        <MultiCircle list={rest}>{children}</MultiCircle>
      ) : (
        children
      )}
    </ContainerCircle>
  )
}

export const ChipRender = ({ chip }: { chip: Chip }) => {
  const color = displayColor(chip)
  return (
    <MultiCircle
      list={[
        { width: 2, color: 'black' },
        { width: 5, color: color },
        { width: 1, color: 'black' },
        { width: 5, color: 'gold', style: 'dashed' },
        { width: 1, color: 'black' },
      ]}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: '55%',
          backgroundColor: color,
        }}
      />
    </MultiCircle>
  )
}
