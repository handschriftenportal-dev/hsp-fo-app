import Typography from '@mui/material/Typography'

import { VariantNameProps } from 'src/contexts/discovery'

export function CardValue(value: string | VariantNameProps[]) {
  if (Array.isArray(value)) {
    return (
      <>
        {value.map((item, index) => (
          <Typography variant="body1" key={`${item.name}_${index}`}>
            {item.name} {item.languageCode && `<${item.languageCode}>`}
          </Typography>
        ))}
      </>
    )
  }
  return <Typography variant="body1">{value}</Typography>
}
