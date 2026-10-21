import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router'
import { makeStyles } from 'tss-react/mui'

import SearchIcon from '@mui/icons-material/Search'
import Button from '@mui/material/Button'

import { useSearchTranslation } from 'src/components/search/utils'
import { searchActions } from 'src/contexts/actions/searchActions'
import { searchSelectors } from 'src/contexts/selectors'

const useStyles = makeStyles()(() => ({
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
  const { classes: cls } = useStyles()
  const { numFound, id } = props
  const dispatch = useDispatch()
  const searchParams = useSelector(searchSelectors.getSearchParams)

  const handleOnClick = () => {
    const newParams = { ...searchParams, isExtended: false }
    dispatch(searchActions.setSearchParams(newParams))
  }

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
        onClick={handleOnClick}
        to={`/search?q=%22${id}%22`}
        variant="contained"
        color="primary"
      >
        {searchT('normOverview', 'search')}
      </Button>
    </div>
  )
}
