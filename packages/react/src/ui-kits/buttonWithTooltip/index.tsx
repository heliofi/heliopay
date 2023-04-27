import { FC, ReactNode } from 'react';
import { Tooltip } from '../tooltip';
import { Button, ButtonProps } from '../button';

interface Props extends ButtonProps {
  showTooltip: boolean;
  tooltipText: string | ReactNode;
}

export const ButtonWithTooltip: FC<Props> = ({
  showTooltip,
  tooltipText,
  ...buttonProps
}) =>
  showTooltip ? (
    <Tooltip tooltipText={tooltipText}>
      <Button {...buttonProps}>{buttonProps.children}</Button>
    </Tooltip>
  ) : (
    <Button {...buttonProps}>{buttonProps.children}</Button>
  );
