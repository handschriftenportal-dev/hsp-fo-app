import React from 'react'

import Typography from '@material-ui/core/Typography'
import makeStyles from '@material-ui/core/styles/makeStyles'
import useTheme from '@material-ui/core/styles/useTheme'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import { SinglePageWrapper } from 'src/components/shared'
import { useSetMetatag, useSetTitle } from 'src/contexts/Metatags'
import { HspObject } from 'src/contexts/discovery'
import { toSearchParams, useParsedSearchParams } from 'src/utils/searchparams'

import { DirectResourceLinks } from '../../../shared/DirectResourceLinks'
import { useSearchTranslation } from '../../../utils'
import { HspObjectDataTable } from './HspObjectDataTable'

interface StyleProps {
  resourceInfoFlexWrap: 'wrap' | 'nowrap'
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    marginTop: theme.spacing(2),
    flexWrap: 'wrap',
  },
  summary: {
    marginTop: theme.spacing(2),
  },
  headline: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(0),
    marginTop: theme.spacing(2),
    flexWrap: (props: StyleProps) => props.resourceInfoFlexWrap,
    [theme.breakpoints.only('xs')]: {
      paddingLeft: theme.spacing(3.5),
      paddingRight: theme.spacing(3.5),
    },
  },
  resourceInfo: {
    marginTop: theme.spacing(2),
    flexShrink: 0,
  },
}))

interface Props {
  hspObject: HspObject
  numOfDescriptions: number
  numOfDigitizeds: number
  onResourceInfoClicked?: (
    resourceType: 'hsp-descriptions' | 'hsp-digitizeds',
  ) => void
}

export function HspObjects({
  hspObject,
  numOfDescriptions,
  numOfDigitizeds,
  onResourceInfoClicked,
}: Readonly<Props>) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'), { noSsr: true })
  const cls = useStyles({ resourceInfoFlexWrap: isMobile ? 'wrap' : 'nowrap' })
  const params = useParsedSearchParams()
  const { searchT } = useSearchTranslation()

  const linkToDetailView = `/search?${toSearchParams({
    ...params,
    hspobjectid: hspObject.id,
  })}`

  const {
    'settlement-display': settlementDisplay,
    'repository-display': repositoryDisplay,
    'idno-display': idnoDisplay,
    'object-type-display': objectTypeDisplay,
    'orig-date-lang-display': origDateLangDisplay,
    'title-display': titleDisplay,
  } = hspObject

  const signatureId = [settlementDisplay, repositoryDisplay, idnoDisplay].join(
    ', ',
  )
  const objectType =
    searchT('data', 'object-type-display', objectTypeDisplay as string) ??
    searchT('data', 'object-type-display', '__MISSING__')
  const origDateLang = origDateLangDisplay ? ` (${origDateLangDisplay}):` : ''
  const title = titleDisplay ? ` ${titleDisplay}` : ''
  const desc = `${objectType}${origDateLang}${title}`

  useSetTitle(signatureId)
  useSetMetatag({ key: 'name', value: 'description', content: desc })

  return (
    <div className={cls.root}>
      <SinglePageWrapper>
        <div>
          <Typography className={cls.title} variant="h1">
            {signatureId}
          </Typography>
          <Typography className={cls.summary} component="p">
            {titleDisplay}
          </Typography>
        </div>
        <div className={cls.resourceInfo}>
          <DirectResourceLinks
            vertical={false}
            numOfDescriptions={numOfDescriptions}
            numOfDigitizeds={numOfDigitizeds}
            linkToDetailView={linkToDetailView}
            onClick={onResourceInfoClicked}
            detailPage={true}
            permalink={hspObject['persistent-url-display']}
          />
        </div>
      </SinglePageWrapper>
      <HspObjectDataTable hspObject={hspObject} />
    </div>
  )
}
