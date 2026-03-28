import { ENTITY_MODE_TAB_QUERY_PARAM } from 'constants/common';
import { useLocation } from 'react-router';

export default function useEntityMode<Code = string>() {
  const location = useLocation();
  const mode = new URLSearchParams(location.search).get(ENTITY_MODE_TAB_QUERY_PARAM || '') || 'common';
  return mode as Code | '';
}
