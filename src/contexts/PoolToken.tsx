import React, { createContext } from 'react';
import { PoolTokenType } from '../impermax-router/interfaces';

const PoolTokenContext = createContext<PoolTokenType>(null);
export default PoolTokenContext;