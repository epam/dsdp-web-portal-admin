import { makeStyles } from '@material-ui/core';
import React from 'react';
import clsx from 'clsx';
import styles from './ErrorNavLink.styles';

type ErrorNavLinkProps = {
  to: string,
  title: string,
  className?: string;
  children?: React.ReactNode,
};

const useStyles = makeStyles(styles, { name: 'ErrorNavLink' });

export default function ErrorNavLink({
  to, title, className, children,
}: ErrorNavLinkProps) {
  const classes = useStyles();
  return <a href={to} title={title} className={clsx(classes.root, className)}>{children}</a>;
}
