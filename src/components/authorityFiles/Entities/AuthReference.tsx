import React from 'react'
import { Link } from 'react-router-dom'

import Button from '@material-ui/core/Button'
import makeStyles from '@material-ui/core/styles/makeStyles'
import SearchIcon from '@material-ui/icons/Search'

import { useSearchTranslation } from 'src/components/search/utils'

const useStyles = makeStyles(() => ({
  subtitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}))

interface AuthReferenceProps {
  id: string
  numFound: string
}

export function AuthReference(props: Readonly<AuthReferenceProps>) {
  const { searchT, searchTT } = useSearchTranslation()
  const cls = useStyles()
  const { numFound, id } = props
  return (
    <div className={cls.subtitle}>
      <div
        id="authorityFileResult"
        dangerouslySetInnerHTML={{
          __html: searchTT(
            {
              numFound,
            },
            'normOverview',
            'filterResult',
          ),
        }}
      />
      <Button
        startIcon={<SearchIcon />}
        component={Link}
        to={`/search?q=%22${id}%22`}
        variant="contained"
        color="primary"
      >
        {searchT('normOverview', 'search')}
      </Button>
    </div>
  )
}
