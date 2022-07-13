import React, { ReactNode } from 'react';

export const Card = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div className={`${className} overflow-visible rounded-lg bg-white shadow`}>
    {children}
  </div>
);
