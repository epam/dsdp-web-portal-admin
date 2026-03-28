import { api } from 'api';
import { API_APPENDIX } from 'constants/baseUrl';
import { map } from 'rxjs/operators';

export const getBpModelerTemplates = () => {
  return api.get$(`${API_APPENDIX}/business-process-modeler-element-templates.json`).pipe(
    map((ajaxResponse) => {
      if (ajaxResponse.xhr.getResponseHeader('Content-Type') !== 'application/json') {
        throw new Error('Invalid content type');
      }
      return ajaxResponse;
    }),
  );
};
