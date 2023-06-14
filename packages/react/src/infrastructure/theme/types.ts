export enum LogoColor {
  BLACK,
  WHITE,
}

export enum ConnectWalletDefaultIconType {
  WITH_COLOR,
  WHITE,
}

export enum ThemeType {
  DARK_MODE = 'DarkMode',
  LIGHT_MODE = 'LightMode',
}

export type ThemeContextType = {
  darkModeFsEnabled: boolean;
  theme: ThemeType;
  toggleTheme: () => void;
};
export interface Theme {
  images: {
    logoImageColor: LogoColor;
    connectWalletInactiveIconType: ConnectWalletDefaultIconType;
  };
  colors: {
    beatLoader: string;

    cssColorScheme: 'dark' | 'light'; // use only for css color-scheme value
    backgroundDashboard: string; // highest parent background
    backgroundContainer: string; // e.g. for blocks in main content area of dashboard
    backgroundContainerAlternative: string; // either same as container, or slightly different
    backgroundPrimary: string; // e.g. for primary button background
    backgroundSecondary: string;
    backgroundSecondaryAlternative: string;
    backgroundSelectedItemHover: string;
    backgroundPrimaryDisabled: string;
    backgroundSecondaryDisabled: string;
    backgroundAlternative: string; // dark grey background for audit button etc (grey on light + dark mode)
    backgroundMarkdownMenu: string; // also used for settings bar
    backgroundSettingsBar: string;
    backgroundBold: string;
    backgroundForCandyDark: string; // always white (has a background gradient),
    backgroundTabActive: string;
    backgroundTabInactive: string;
    backgroundWallet: string;
    backgroundCheckboxSliding: string;
    backgroundCheckboxSlidingNotChecked: string;
    backgroundCheckboxSlidingChecked: string;
    backgroundHighestContrast: string;
    backgroundCode: string;
    backgroundTooltip: string;
    backgroundTableDisabledMenu: string;
    backgroundCheckoutFooter: string;
    backgroundDropdownHover: string;
    backgroundDropdownActive: string;

    fillIcon: string;

    backgroundWarningTopBar: string;

    backgroundSuccessTopBar: string;
    backgroundCancelledTopBar: string;
    backgroundSuccess: string;
    backgroundSuccessAlternative: string;
    textSuccess: string;
    textSuccessAlternative: string; // slight variation - used on payment approval cards
    backgroundNeutral: string;
    backgroundCancelled: string;
    textNeutral: string;
    textCancelled: string;
    backgroundWarning: string;
    backgroundWarningAlternative: string;
    textWarning: string;
    textWarningAlternative: string;
    textCancelledAlternative: string;
    backgroundDanger: string;
    textDanger: string;

    border: string; // most borders, inc disabled checkbox border
    borderTab: string;
    borderSlidingCheckbox: string;
    borderAlternative: string;
    borderInactive: string; // e.g. checkboxes that are not checked
    borderPrimary: string; // e.g. for active checkbox

    textDisplay: string; // black
    textContainerTitle: string; // h4 grey100
    textMenuInactive: string; // h5 grey100
    textMenuActive: string; // orange h5
    textBody: string; // grey 100
    textBodyInactive: string; // grey 90
    textBodyActive: string; // h60
    textLabel: string; // h80
    textLabelHeaderInactive: string; // grey 80
    textLabelHeaderActive: string; // grey 100
    textTooltip: string; // h5
    textCode: string;
    textRevealedContent: string;
    textCell: string;
    textCellSubtitle: string;
    textTableDisabledMenu: string;
    textCreatePaymentActive: string;
    textCreatePaymentInactive: string;

    textHighestContrast: string; // pure black (in light mode)
    textHighContrast: string; // standard text (some of these need migrating to textMenu)
    textLowContrast: string;
    textLowestContrast: string;
    textOnPrimaryBackgroundContrast: string; // low contrast on orange bg

    textLink: string;
    textLinkHover: string;
    textOnPrimaryBackgroundHover: string; // e.g. white text on h60 orange bg
    textMarkdownText: string;
    textSidebar: string;
    textSidebarHover: string;
    textSidebarDisabled: string;
    textTabActive: string;
    textTabInactive: string;
    textWallet: string;
    textDetected: string;
    textPriceBanner: string;

    textButton: string; // for all button states except disabled
    textButtonPrimaryDisabled: string; // also for white text on backgroundAlternative (dark bg in both dark+light mode)
    textButtonSecondaryDisabled: string;

    fillOnPrimaryBackground: string; // e.g. icons on h60 orange background
    fillCloseButton: string; // modal close buttons

    gradientCandy: string;
    gradientMerchant: string;
    gradientCandyDark: string;
    gradientCandyDown: string;
    gradientOrangeFade: string;

    alert: string;
    success: string;

    shadowDefault: string;
    shadowPrimary30Size2xl: string;
    shadowPrimary40SizeLg: string;
    shadowPrimary50Size2xl: string;
    shadowPrimary60SizeLg: string;
    shadowWalletButton: string; // top header
    shadowHeliox: string;
  };
}

export type ThemeColor = keyof Theme['colors'];
