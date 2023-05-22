/*
 * MIT License
 *
 * Copyright (c) 2023 Staatsbibliothek zu Berlin - Preußischer Kulturbesitz
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

import React, { ReactNode, useEffect, useState } from 'react'
import { Menu } from 'hsp-fo-cms/types'
import Divider from '@material-ui/core/Divider'
import { walk } from 'src/utils/walk'
import { useModules } from 'src/contexts/modules'
import {
  useSelector,
  selectors,
  useDispatch,
  actions,
} from 'src/contexts/state'
import { MenuItem } from './MenuItem'

interface Props {
  mobile: boolean
}

export function CmsMenu(props: Props) {
  const dispatch = useDispatch()
  const modules = useModules()
  const sideBarOpen = useSelector(selectors.getSidebarOpen)
  const [menus, setMenus] = useState<Menu[]>([])
  const [menuExpandMap, setMenuExpandMap] = useState<Record<string, boolean>>(
    {}
  )
  const elems: ReactNode[] = []

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

  useEffect(() => {
    let isMounted = true

    modules.cms.getMenus().then((newMenus) => {
      // Switching between mobile and desktop screen may cause that this
      // callback executes after the component was unmounted. This results
      // in the "Can't perform a React state update on an unmounted component" error.
      // So check if the component is still mounted before updating the state.
      if (isMounted) {
        setMenus(newMenus)
      }
    })

    return () => {
      // This runs when the component is about to unmount.
      isMounted = false
    }
  }, [modules.cms.getLanguage()])

  /************************************
   * Assemble elements to render
   ***********************************/

  function createMenuItemsFromMenuTree(
    topMenu: Menu,
    expandable: boolean,
    expanded: boolean
  ) {
    function addMenuItem(menu: Menu, level: number) {
      if (menu === topMenu) {
        elems.push(
          <MenuItem
            key={menu.id}
            href={menu.link}
            label={menu.label}
            level={0}
            icon="info"
            selected={window.location.href === menu.link}
            onClick={handleMenuClick}
            onExpand={expandable && !expanded ? expandMenu(menu.id) : undefined}
            onCollapse={
              expandable && expanded ? collapseMenu(menu.id) : undefined
            }
          />
        )
      } else if (expanded) {
        elems.push(
          <MenuItem
            key={menu.id}
            href={menu.link}
            label={menu.label}
            level={level + 1}
            selected={window.location.href === menu.link}
            onClick={handleMenuClick}
          />
        )
      }
    }
    return addMenuItem
  }

  menus.forEach((topMenu, index) => {
    let currentLocationInMenu = false
    walk(topMenu, (menu) => {
      if (menu.link === window.location.href) {
        currentLocationInMenu = true
      }
    })

    const expandable = props.mobile && topMenu.children.length > 0
    const expanded =
      menuExpandMap[topMenu.id] === undefined
        ? sideBarOpen && currentLocationInMenu
        : sideBarOpen && menuExpandMap[topMenu.id]

    walk(topMenu, createMenuItemsFromMenuTree(topMenu, expandable, expanded))

    if (index < menus.length - 1) {
      elems.push(<Divider key={topMenu.id + 'divider'} />)
    }
  })

  return <>{elems}</>
}
