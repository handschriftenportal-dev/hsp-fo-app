import { makeStyles } from 'tss-react/mui'

import Link from '@mui/material/Link'

import { AcfProject } from 'src/contexts/wordpress'

import { extractMail } from '../utils/extractMail'

interface Props {
  contact: AcfProject['contact']
}

const useStyles = makeStyles()(() => ({
  contact: {
    hyphens: 'none',
  },
}))

/**
 * Renders contact information to be displayed in the key value table.
 *
 * Transforms email addressed to links.
 */
export function Contacts(props: Readonly<Props>) {
  const { classes: cls } = useStyles()
  return (
    <>
      {props.contact.split(',').map((contactPart) => {
        if (contactPart.includes('@')) {
          const mail = extractMail(contactPart) ?? ''

          return (
            <div key={mail}>
              Mail:{' '}
              <Link
                className={cls.contact}
                color="primary"
                href={`mailto:${mail}`}
              >
                {mail}
              </Link>
            </div>
          )
        }
        return contactPart + '\r\n'
      })}
    </>
  )
}
