import { SnackbarKey, SnackbarMessage, useSnackbar } from 'notistack'
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigation } from 'react-router-dom'

import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import StackedToast from 'src/components/shared/StackedToast'
import { useTranslation } from 'src/contexts/i18n'

const useStyles = makeStyles(() => ({
  titleTypo: {
    fontWeight: 'bold',
  },
}))

export const useLoadingSnackbar = (title: string, isSuspense?: boolean) => {
  const { closeSnackbar, enqueueSnackbar } = useSnackbar()
  const cls = useStyles()
  const navigation = useNavigation()
  const { t } = useTranslation()
  const [initTimer, setInitTimer] = useState<NodeJS.Timeout | undefined>(
    undefined,
  )

  const TIMEOUT_DURATION = 5000

  const Toast = useCallback(
    (key: SnackbarKey, message: SnackbarMessage) => (
      <StackedToast
        id={key}
        message={
          <div>
            <Typography variant="subtitle1" className={cls.titleTypo}>
              {title}
            </Typography>
            <Typography variant="body1">{message}</Typography>
          </div>
        }
      />
    ),
    [],
  )

  const setTimer = () => {
    return setTimeout(() => {
      enqueueSnackbar(t('notifications.loadingMsg'), {
        content: Toast,
        preventDuplicate: true,
        autoHideDuration: null,
      })
    }, TIMEOUT_DURATION)
  }
  const clearAndClose = (timer: NodeJS.Timeout) => {
    clearTimeout(timer)
    closeSnackbar()
  }

  useEffect(() => {
    const timer = setTimer()
    setInitTimer(timer)

    return () => {
      if (timer) {
        clearAndClose(timer)
      }
    }
  }, [])

  useEffect(() => {
    if (!isSuspense) {
      let loadTimer: NodeJS.Timeout | undefined
      if (navigation.state === 'loading') {
        loadTimer = setTimer()
      } else {
        if (initTimer) {
          clearAndClose(initTimer)
        }
        if (loadTimer) {
          clearAndClose(loadTimer)
        }
      }

      return () => {
        if (loadTimer) {
          clearAndClose(loadTimer)
        }
      }
    }
  }, [navigation.state, initTimer])
}
