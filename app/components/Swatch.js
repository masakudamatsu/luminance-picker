import PropTypes from 'prop-types';
import styled from 'styled-components';
import {useState} from 'react';

import copyToClipboard from '../utils/copyToClipboard';

const Button = styled.button`
  background-color: ${props => props.backgroundColor};
  color: white; /* TODO: Change according to the overall color palette */
  height: 48px; /* For clickability with a thumb */
  text-align: center;
  width: 100%;
`;

function Swatch(props) {
  const rgbCode = `rgb(${props.r}, ${props.g}, ${props.b})`;

  const [clicked, setClicked] = useState(false);
  const handleClick = event => {
    copyToClipboard(rgbCode);
    setClicked(true);
    setTimeout(() => {
      setClicked(false);
    }, 1500);
  };
  return (
    <Button
      backgroundColor={rgbCode}
      data-testid={`rgb-${props.r}-${props.g}-${props.b}`}
      id={rgbCode}
      onClick={handleClick}
      type="button"
    >
      {clicked ? 'Copied!' : rgbCode}
    </Button>
  );
}

Swatch.propTypes = {
  r: PropTypes.number.isRequired,
  g: PropTypes.number.isRequired,
  b: PropTypes.number.isRequired,
};

export default Swatch;
