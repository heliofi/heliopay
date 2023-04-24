import { useContext } from 'react';
import { ConnectContext } from '../providers/connect';

export const useConnect = () => useContext(ConnectContext);
