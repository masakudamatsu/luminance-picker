import PropTypes from 'prop-types';
import {withUrqlClient} from 'next-urql';
import gql from 'graphql-tag';
import {useQuery} from 'urql';

import Swatch from '../components/Swatch';

function Results(props) {
  const FEED_QUERY = gql`
    {
      feed(hue: ${props.hue}, contrastRatio: ${props.contrastRatio}, orderBy: { chroma: desc }) {
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

  const colorSwatches = colorsToRender.map((color, i) => (
    <Swatch r={color.red} g={color.green} b={color.blue} key={`color${i}`} />
  ));

  return (
    <>
      <h1>Luminance Picker: Results</h1>
      <p>{`Contrast ratio with pure black: ${props.contrastRatio}`}</p>
      <p>{`Selected hue: ${props.hue}`}</p>
      <ul>{colorSwatches}</ul>
    </>
  );
}

Results.propTypes = {
  contrastRatio: PropTypes.string.isRequired,
  hue: PropTypes.string.isRequired,
};

export default withUrqlClient(
  (_ssrExchange, ctx) => ({
    url: 'http://localhost:4000',
  }),
  {ssr: true},
)(Results);
