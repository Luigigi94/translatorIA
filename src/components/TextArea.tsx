import { Form } from 'react-bootstrap'
import { SectionType } from '../types.d'
import React, { type CSSProperties } from 'react'

interface Props {
  type: SectionType
  loading?: boolean
  onChange: (value: string) => void
  value: string
}
const commonStyles: CSSProperties = { border: '0', height: '200px', resize: 'both' }

const getPlaceHolder = ({ type, loading }: { type: SectionType, loading?: boolean }) => {
  if (type === SectionType.From) return 'Introducir texto'
  if (loading === true) return 'Traduciendo...'
  return 'Traducción'
}

export const TextArea = ({ type, loading, value, onChange }: Props) => {
  const styles = type === SectionType.From
    ? commonStyles
    : { ...commonStyles, backgroundColor: '#f5f5f5' }

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value)
  }
  return (
    <Form.Control
      as='textarea'
      disabled= {type === SectionType.To }
      placeholder= {getPlaceHolder({ type, loading })}
      autoFocus={type === SectionType.From}
      style= {styles}
      value={value}
      onChange={handleChange}
    />
  )
}
