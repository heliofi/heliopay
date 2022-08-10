import { ASSET_URL } from '../../domain/constants/common';

export type IconProps = {
  iconName?: string;
  className?: string;
  gradient?: boolean;
};

const CurrencyIcon = ({ className, gradient = false, iconName }: IconProps) => {
  const filename = iconName + (gradient ? '' : '_uncolored');
  return (
    <div className={className}>
      {iconName && <img alt={iconName} src={`${ASSET_URL}/${filename}.svg`} />}
    </div>
  );
};

export default CurrencyIcon;
