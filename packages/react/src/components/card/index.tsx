import React from 'react';

export const Card = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`${className} overflow-visible rounded-lg bg-white shadow`}>
    {children}
  </div>
);
