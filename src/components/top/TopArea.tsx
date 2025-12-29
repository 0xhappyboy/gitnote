import React from "react"
import TopMenuBar from "./TopMenuBar"
import { useLocation } from 'react-router-dom'

const withLocation = (Component: React.ComponentType<any>) => {
  return (props: any) => {
    const location = useLocation();
    return <Component {...props} location={location} />;
  };
};

class TopArea extends React.Component<{ location?: any }, {}> {
  render() {
    const { location } = this.props;
    return (
      <div>
        <TopMenuBar />
      </div>
    )
  }
}

export default withLocation(TopArea);