import {useState} from 'react';
import PropTypes from 'prop-types';
import {withUrqlClient} from 'next-urql';
import gql from 'graphql-tag';
import {useQuery} from 'urql';

import Swatch from '../components/Swatch';
import ColorCodeDisplay from '../components/ColorCodeDisplay';
import CopyButton from '../components/CopyButton';
import TextField from '../components/TextField';

import {ResultsWrapper, LiSwatchWrapper} from '../theme/style';

function Results(props) {
  const [clickedColorCode, setClickedColorCode] = useState('');
  const [clipboardError, setClipboardError] = useState(false);

  const FEED_QUERY = gql`
    {
      feed(hue: ${props.hue}, contrastRatio: ${props.contrastRatio}, orderBy: [{ chroma: asc }, { hue: asc }]) {
        red
        green
        blue
        contrast_ratio
        hue
        chroma
      }
    }
  `;
  const [result] = useQuery({
    query: FEED_QUERY,
  });

  const {data, fetching, error} = result;

  if (fetching) return <div>Fetching</div>;
  if (error) return <div>Error</div>;

  const colorsToRender = data.feed;

  const copyColorCode = () => {
    if (navigator.clipboard) {
      // For browsers supporting Clipboard API
      navigator.clipboard.writeText(clickedColorCode);
    } else {
      if (document.queryCommandSupported('copy')) {
        // For browsers not supporting Clipboard API
        const colorCode = document.getElementById('color-code-display');
        const range = document.createRange();
        range.selectNode(colorCode);
        window.getSelection().addRange(range);
        try {
          const success = document.execCommand('copy');
          const message = success ? 'successful' : 'unsuccessful';
          console.log(`Copying was ${message}`);
        } catch (err) {
          console.log(
            "unable to copy due to the failure of executing execCommand('copy')",
          );
          setClipboardError(true);
          return;
        }
        window.getSelection().removeAllRanges();
      } else {
        console.log(
          "unable to copy due to the lack of support for execCommand('copy')",
        );
        setClipboardError(true);
        return;
      }
    }
  };

  const contrastRatioFieldLabel = <span>Contrast Ratio to Black</span>;

  const handleChangeContrastRatio = event => {
    props.setContrastRatio(event.target.value);
  };

  const hueFieldLabel = <span>Selected hue</span>;

  return (
    <>
      <h1>Luminance Picker: Results</h1>
      <TextField
        darkMode={props.darkMode}
        id="contrastRatio"
        inputInvalid={false}
        label={contrastRatioFieldLabel}
        alertMissing={false}
        handleBlur={() => {
          return null;
        }}
        handleChange={handleChangeContrastRatio}
        pattern="d+"
        value={props.contrastRatio}
      />
      <TextField
        darkMode={props.darkMode}
        id="hue-field"
        inputInvalid={false}
        label={hueFieldLabel}
        alertMissing={false}
        handleBlur={() => {
          return null;
        }}
        handleChange={() => {
          return null;
        }}
        pattern="d+"
        testId="hue-in-degrees"
        value={props.hue}
      />
      <ColorCodeDisplay>{clickedColorCode}</ColorCodeDisplay>
      <CopyButton copyColorCode={copyColorCode} />
      <ResultsWrapper darkMode={props.darkMode}>
        {colorsToRender.map((color, i) => (
          <LiSwatchWrapper key={`color${i}`}>
            <Swatch
              r={color.red}
              g={color.green}
              b={color.blue}
              setClickedColorCode={setClickedColorCode}
            />
          </LiSwatchWrapper>
        ))}
      </ResultsWrapper>
    </>
  );
}

Results.propTypes = {
  contrastRatio: PropTypes.string.isRequired,
  hue: PropTypes.string.isRequired,
};

export default withUrqlClient(
  (_ssrExchange, ctx) => ({
    url: 'http://localhost:4000/graphql',
  }),
  {ssr: true},
)(Results);
