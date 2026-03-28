import { api } from 'api';
import { API_APPENDIX } from 'constants/baseUrl';
import { Report } from 'types/report';

export const REPORT_API_APPENDIX = 'api/report-explorer';

export const getReportList = () => {
  return api.get$<Report[]>(`${API_APPENDIX}/${REPORT_API_APPENDIX}`);
};
