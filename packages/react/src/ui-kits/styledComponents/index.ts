import styled from 'styled-components';
import { StyledInterface } from 'styled-components';

export * from 'styled-components';

const defaultStyled: StyledInterface = typeof styled === 'function' ? styled : (styled as any).default;

export { defaultStyled as default };
