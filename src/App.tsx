/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Layout } from './components/Layout';
import { AppProvider } from './store/AppContext';

export default function App() {
  return (
    <AppProvider>
      <Layout />
    </AppProvider>
  );
}

