import {useState} from 'react';
import PropTypes from 'prop-types';
import {
  Abbr,
  ColorCodeField,
  SpacerHorizontal,
  Input,
  InputDescriptionWrapper,
  InputExamplesWrapper,
  InputWrapper,
  Label,
  ListItemInputValueExample,
  ParagraphErrorMessage,
  ParagraphInputExamples,
  UnorderedListInputValueExamples,
  SpacerVertical,
} from '../theme/style';
import {getRgbFromHex, getRgbFromHsl} from '../utils/helpers';
import color from '../theme/color';

function InputColorCode(props) {
  const [invalid, setInvalid] = useState(false);

  const regexHexText = '#([A-Fa-f\\d]{3}){1,2}';
  const regexRgbText =
    'rgb\\((1?\\d?\\d|2[0-4]\\d|25[0-5])(,\\s*(1?\\d?\\d|2[0-4]\\d|25[0-5])){2}\\)';
  const regexHslText =
    'hsl\\((360|3[0-5]\\d|[1-2]?\\d?\\d)(,\\s*(100|[1-9]?\\d)%){2}\\)';

  // Generate the RGB color code
  let backgroundColor = color.darkMode.background;
  if (props.red && props.green && props.blue) {
    backgroundColor = `rgb(${props.red}, ${props.green}, ${props.blue})`;
  }

  const handleBlur = event => {
    // When nothing is entered
    if (!event.target.value) {
      return;
    }
    // Validation
    const newInputIsInvalid = event.target.validity.patternMismatch;
    if (!invalid && newInputIsInvalid) {
      setInvalid(true);
    }
    if (invalid && !newInputIsInvalid) {
      setInvalid(false);
    }
    if (!newInputIsInvalid) {
      // Remove all the whitespaces from the user's input value
      const newInputValue = event.target.value.trim().replace(/\s/g, '');
      // Convert into RGB code
      let newInputValueRGB;
      // HEX
      const regexHex = new RegExp(regexHexText);
      if (regexHex.test(newInputValue)) {
        newInputValueRGB = getRgbFromHex(newInputValue);
      }
      // RGB
      const regexRgb = new RegExp(regexRgbText);
      if (regexRgb.test(newInputValue)) {
        newInputValueRGB = newInputValue;
      }
      // HSL
      const regexHsl = new RegExp(regexHslText);
      if (regexHsl.test(newInputValue)) {
        newInputValueRGB = getRgbFromHsl(newInputValue);
      }
      // Extract RGB values
      const rgbValues = newInputValueRGB.slice(4, -1).split(',');
      props.setRed(rgbValues[0]);
      props.setGreen(rgbValues[1]);
      props.setBlue(rgbValues[2]);
      props.updateContrastRatio(rgbValues[0], rgbValues[1], rgbValues[2]);
    }
  };
  return (
    <ColorCodeField backgroundColor={backgroundColor} darkMode={props.darkMode}>
      <InputWrapper>
        <Label htmlFor="inputColorCode">
          Enter <Abbr>css</Abbr> color code
        </Label>
        <Input
          type="text"
          darkMode={props.darkMode}
          error={invalid}
          id="inputColorCode"
          onBlur={handleBlur}
          pattern={`${regexHexText}|${regexRgbText}|${regexHslText}`}
          value={props.inputColorCode}
        />
      </InputWrapper>
      <InputDescriptionWrapper>
        <InputExamplesWrapper>
          <ParagraphInputExamples>Examples:</ParagraphInputExamples>
          <SpacerHorizontal />
          <UnorderedListInputValueExamples>
            <ListItemInputValueExample>
              rgb(66, 135, 245)
            </ListItemInputValueExample>
            <ListItemInputValueExample>
              hsl(217, 90%, 61%)
            </ListItemInputValueExample>
            <ListItemInputValueExample>#4287f5</ListItemInputValueExample>
          </UnorderedListInputValueExamples>
        </InputExamplesWrapper>
        <SpacerVertical />
        <ParagraphErrorMessage
          data-testid="colorCodeError"
          darkMode={props.darkMode}
          error={invalid}
        >
          Please enter a valid <Abbr>css</Abbr> color code
        </ParagraphErrorMessage>
      </InputDescriptionWrapper>
    </ColorCodeField>
  );
}

InputColorCode.propTypes = {
  red: PropTypes.string.isRequired,
  green: PropTypes.string.isRequired,
  blue: PropTypes.string.isRequired,
  setRed: PropTypes.func.isRequired,
  setGreen: PropTypes.func.isRequired,
  setBlue: PropTypes.func.isRequired,
  updateContrastRatio: PropTypes.func.isRequired,
  darkMode: PropTypes.bool.isRequired,
};

export default InputColorCode;
