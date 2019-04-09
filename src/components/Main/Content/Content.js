import React, {Component} from 'react'
import './Content.css'
import MainInfo from './MainInfo'
import DetailedInfo from './DetailedInfo'


class Content extends Component {

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.update;
    }

    render() {
        return (
            <div id="mainContent">

                <MainInfo params={this.props.params}
                          fields={this.props.fields}
                          update={this.props.update}
                />
                <hr/>
                <DetailedInfo params={this.props.params}
                              fields={this.props.fields}
                              update={this.props.update}
                              onUpdateChange={this.props.onUpdateChange}
                />
            </div>
        )
    }
}

export default Content
