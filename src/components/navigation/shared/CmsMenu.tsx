import React, { ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useLoaderData } from 'react-router-dom'

import Divider from '@material-ui/core/Divider'

import { actions } from 'src/contexts/actions/actions'
import { selectors } from 'src/contexts/selectors'
import { MenuProps, MenusProps } from 'src/contexts/wordpress'
import { menuWalker } from 'src/utils'

import { MenuItem } from './MenuItem'

interface CmsMenuProps {
  mobile: boolean
}

export function CmsMenu(props: Readonly<CmsMenuProps>) {
  const { i18n } = useTranslation()
  const dispatch = useDispatch()
  const sideBarOpen = useSelector(selectors.getSidebarOpen)
  const finalMenus = useLoaderData() as MenusProps

  const [menuExpandMap, setMenuExpandMap] = useState<Record<string, boolean>>(
    {},
  )
  const language = i18n.resolvedLanguage
  const langKey = language === 'de' ? 'de' : 'en'

  const elems: ReactNode[] = []
  const currentUrl = new URL(window.location.href)

  const handleMenuClick = () => {
    const mobileOrSidebarClosed = props.mobile || !sideBarOpen
    mobileOrSidebarClosed && dispatch(actions.toggleSidebar())
  }

  const expandMenu = (id: string) => () => {
    setMenuExpandMap({
      ...menuExpandMap,
      [id]: true,
    })
  }

  const collapseMenu = (id: string) => () => {
    setMenuExpandMap({
      ...menuExpandMap,
      [id]: false,
    })
  }

  /************************************
   * Assemble elements to render
   ***********************************/

  function createMenuItemsFromMenuTree(
    topMenu: MenuProps,
    expandable: boolean,
    expanded: boolean,
  ) {
    function addMenuItem(menu: MenuProps, level: number) {
      const menuUrl = new URL(menu.link)
      const selected = currentUrl.pathname === menuUrl.pathname
      if (menu === topMenu) {
        elems.push(
          <MenuItem
            key={menu.id}
            href={menuUrl.pathname}
            label={menu.label}
            level={0}
            icon="info"
            selected={selected}
            onClick={handleMenuClick}
            onExpand={expandable && !expanded ? expandMenu(menu.id) : undefined}
            onCollapse={
              expandable && expanded ? collapseMenu(menu.id) : undefined
            }
          />,
        )
      } else if (expanded) {
        elems.push(
          <MenuItem
            key={menu.id}
            href={menuUrl.pathname}
            label={menu.label}
            level={level + 1}
            selected={selected}
            onClick={handleMenuClick}
          />,
        )
      }
    }
    return addMenuItem
  }

  if (finalMenus[langKey]) {
    finalMenus[langKey].forEach((topMenu, index) => {
      let currentLocationInMenu = false
      menuWalker(topMenu, (menu) => {
        const menuUrl = new URL(menu.link)
        if (currentUrl.pathname === menuUrl.pathname) {
          currentLocationInMenu = true
        }
      })

      const expandable = props.mobile && topMenu.children.length > 0
      const expanded =
        menuExpandMap[topMenu.id] === undefined
          ? sideBarOpen && currentLocationInMenu
          : sideBarOpen && menuExpandMap[topMenu.id]

      menuWalker(
        topMenu,
        createMenuItemsFromMenuTree(topMenu, expandable, expanded),
      )

      if (index < finalMenus[langKey].length - 1) {
        elems.push(<Divider key={topMenu.id + 'divider'} />)
      }
    })
  }

  return <>{elems}</>
}
