import { MASTER_VERSION_ID, VERSION_ID } from 'constants/common';

export const isMaster = (version: string): boolean => version === MASTER_VERSION_ID;

export const getRoutePathWithVersion = (pathname: string, version: string) => {
  return pathname.replace(VERSION_ID, version);
};
