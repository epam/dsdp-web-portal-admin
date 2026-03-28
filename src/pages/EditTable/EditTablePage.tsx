import React, { useCallback, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import TableLayout from 'components/Layouts/TableLayout';
import useEntityMode from 'hooks/useEntityMode';
import { TableModeCode } from 'types/table';
import useVersion from 'hooks/useVersion';
import { getRoutePathWithVersion } from 'utils/versions';
import { useDispatch, useSelector } from 'react-redux';
import { ROUTES } from 'constants/routes';
import {
  getTableByNameClean,
  getTableByNameRequest,
  selectRegistryTable,
  selectRegistryTableIndexes,
  selectTableEditPageIsLoading,
} from 'store/tables';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import TableColumns from 'components/TableManagement/TableColumns';
import TableIndexes from 'components/TableManagement/TableIndexes';
import TableFields from '../../components/TableManagement/TableFields/TableFields';

export default function EditTablePage() {
  const { versionId } = useVersion();
  const navigate = useNavigate();
  const { t } = useTranslation('pages', { keyPrefix: 'editTable' });
  const params = useParams<{ tableName: string }>();
  const dispatch = useDispatch();
  const tableMode = useEntityMode<TableModeCode>();
  const table = useSelector(selectRegistryTable);
  const tableIndexes = useSelector(selectRegistryTableIndexes);
  const isLoading = useSelector(selectTableEditPageIsLoading);
  const methods = useForm({
    mode: 'all',
    shouldUnregister: false,
    defaultValues: {
      name: '',
      description: '',
      objectReference: false,
    },
  });
  const { setValue } = methods;

  useEffect(() => {
    if (table) {
      const {
        name, description, objectReference,
      } = table;
      setValue('name', name);
      setValue('description', description);
      setValue('objectReference', objectReference);
    }
  }, [setValue, table]);

  const handleCancel = useCallback(() => {
    navigate(getRoutePathWithVersion(ROUTES.TABLE_LIST, versionId));
  }, [navigate, versionId]);

  useEffect(() => {
    dispatch(getTableByNameRequest({ name: params.tableName, versionId }));
    return () => {
      dispatch(getTableByNameClean());
    };
  }, [dispatch, params, versionId]);

  return (
    <FormProvider {...methods}>
      <TableLayout
        tableName={table?.name || ''}
        isLoading={isLoading}
        onCancel={handleCancel}
        onSubmit={() => undefined}
        title={t('title')}
        submitButtonText={t('text.createButton')}
        isReadOnly
      >
        {tableMode === TableModeCode.common && <TableFields isReadOnly />}
        {tableMode === TableModeCode.columns && <TableColumns columns={table?.columns || {}} />}
        {tableMode === TableModeCode.indexes && <TableIndexes indexes={tableIndexes} />}
      </TableLayout>
    </FormProvider>
  );
}
