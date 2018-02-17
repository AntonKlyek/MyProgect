import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {branch} from 'baobab-react/higher-order';
import {Menu, MenuItem} from '@blueprintjs/core';
import _ from 'lodash';
import cx from 'classnames';

import {branches} from '../../data';
import {selectExtension} from '../../actions';

import stylesheet from './LeftPanel.css';

class LeftPanel extends Component {
    handleSelectExtension(index) {
        const {dispatch} = this.props;
        dispatch(selectExtension, index);
    }

    render() {
        const {className, extensions} = this.props;

        return <div className={cx(stylesheet.root, className)}>
            <Menu>
                {_.map(extensions, ({title, icon}, index) => <MenuItem
                    key={index}
                    icon={icon}
                    text={title}
                    onClick={() => this.handleSelectExtension(index)}
                />)}
            </Menu>
        </div>;
    }
}

LeftPanel.propTypes = {
    className: PropTypes.string,
    extensions: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string,
        icon: PropTypes.string
    })),
    currentExtension: PropTypes.number,
    dispatch: PropTypes.func
};

export default branch({
    extensions: branches.EXTENSIONS,
    currentExtension: branches.CURRENT_EXTENSION
}, LeftPanel);
