import { cls } from '@libs/client/utils';
import React, { ReactChildren, ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  loading?: boolean;
  [key: string]: any;
}

export default function Button({
  children,
  loading = false,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={cls(
        { classNames: 'px-10 py-5' },
        { classNames: 'border border-dashed border-teal-500' },
        { classNames: 'rounded-lg shadow-md' },
        { classNames: 'bg-teal-100 text-gray-500' },
        {
          prefix: 'hover',
          classNames: 'border-teal-700 bg-teal-500 text-gray-700',
        },
        loading ? { classNames: 'opacity-50' } : { classNames: '' }
      )}
    >
      {children}
    </button>
  );
}
