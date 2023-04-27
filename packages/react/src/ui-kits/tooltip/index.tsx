import { FC, ReactNode } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import { Placement } from '@popperjs/core';
import { StyledTooltip, StyledTooltipContainer } from './styles';

interface Props {
  children: ReactNode;
  tooltipText: string | ReactNode;
  placement?: Placement;
}

export const Tooltip: FC<Props> = ({
  children,
  tooltipText,
  placement = 'top',
}) => {
  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip({ placement });

  return (
    <StyledTooltipContainer>
      <div ref={setTriggerRef}>{children}</div>

      {visible && (
        <StyledTooltip ref={setTooltipRef} {...getTooltipProps()}>
          {tooltipText}
        </StyledTooltip>
      )}
    </StyledTooltipContainer>
  );
};
