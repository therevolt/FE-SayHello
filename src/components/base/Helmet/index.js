import React from "react";
import { Helmet } from "react-helmet";

class HelmetTitle extends React.PureComponent {
  render() {
    return (
      <Helmet>
        <title>{this.props.title}</title>
      </Helmet>
    );
  }
}

export default HelmetTitle;
