import React, {Component} from 'react'
import Form from './Form'

class LeftSideBar extends Component {

    render() {
        const {fields}= this.props;
        return (
                <Form fields = {fields}>

                </Form>
        )
    }
}

export default LeftSideBar
