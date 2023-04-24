import React from 'react';
import { Factory } from '../../assets/icons/Factory';

export type IconProps = {
  iconName?: string;
  className?: string;
  gradient?: boolean;
};

export const Icon = ({ className, gradient = false, ...rest }: IconProps) => {
  return (
    <div className={className}>
      <Factory gradient={gradient} {...rest} />
    </div>
  );
};
