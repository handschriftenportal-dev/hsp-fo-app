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

import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Scrolling } from './Scrolling'
import { Home } from 'src/pages/Home'
import { Search } from 'src/pages/Search'
import { Workspace } from 'src/pages/Workspace'
import { Cms } from 'src/pages/Cms'
import { Projects } from 'src/pages/Projects'
import { SkipLink } from 'src/components/navigation/shared/SkipLink'

export function Router() {
  return (
    <>
      <BrowserRouter>
        <SkipLink />
        <Scrolling />
        <Switch>
          <Route path="/search" component={Search} />
          <Route path="/workspace" component={Workspace} />
          <Route path="/info" component={Cms} />
          <Route path="/projects" component={Projects} />
          <Route path="/" component={Home} />
        </Switch>
      </BrowserRouter>
    </>
  )
}
