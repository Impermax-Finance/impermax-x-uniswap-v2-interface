// ray test touch <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// ray test touch >

import { createContext } from 'react';
import { PoolTokenType } from '../impermax-router/interfaces';

const PoolTokenContext = createContext<PoolTokenType>(null);
export default PoolTokenContext;
