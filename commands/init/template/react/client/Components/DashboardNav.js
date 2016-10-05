import React from 'react';

class DashboardNav extends React.Component {

  render () {
    return (
      <div>
        <nav>
          <span>Welcome back, { this.props.displayName }</span>
        </nav>
      </div>
    );
  }

}

DashboardNav.propTypes = {
  displayName: React.PropTypes.string
};

DashboardNav.defaultProps = {
  displayName: 'unknown'
};

export default DashboardNav;