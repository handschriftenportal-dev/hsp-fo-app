import { useSelector } from 'react-redux'
import { makeStyles } from 'tss-react/mui'

import BackButton from 'src/components/search/shared/BackButton'
import BackWorkspaceButton from 'src/components/search/shared/BackWorkspaceButton'
import { searchSelectors } from 'src/contexts/selectors'
import {
  ParsedSearchParams,
  useParsedSearchParams,
} from 'src/utils/searchparams'

const useStyles = makeStyles()(() => ({
  backButton: {
    display: 'flex',
    justifyContent: 'end',
  },
}))

export function AuthorityFileNavigation() {
  const { classes: cls } = useStyles()
  const params: ParsedSearchParams = useParsedSearchParams()
  const searchParams = useSelector(searchSelectors.getSearchParams)

  const backParams = {
    ...searchParams,
    fromWorkspace: undefined,
  }

  return (
    <div id="resultNav" tabIndex={-1} className={cls.backButton}>
      {params.fromWorkspace && <BackWorkspaceButton />}
      {/* Without a manuscript in the session's search state (direct entry via
          deep link or new tab) the back target would be an empty /search. */}
      {searchParams.hspobjectid && (
        <BackButton
          backParams={backParams}
          preventScrollReset={false}
          btnType="backToKod"
        />
      )}
    </div>
  )
}
