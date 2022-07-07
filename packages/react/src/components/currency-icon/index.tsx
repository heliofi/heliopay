export type IconProps = {
  iconName?: string;
  className?: string;
  gradient?: boolean;
};

const ASSET_URL = 'https://helio-assets.s3.eu-west-1.amazonaws.com';

const CurrencyIcon = ({ className, gradient = false, iconName }: IconProps) => {
  const filename = iconName + (gradient ? '' : '_uncolored');
  return (
    <div className={className}>
      {iconName && (
        <img
          alt={iconName}
          src={`${ASSET_URL}/${filename}.svg`}
        />
      )}
    </div>
  );
};

export default CurrencyIcon;
