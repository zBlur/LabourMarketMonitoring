import React, {Component} from 'react'

class DateBox extends Component {

    render() {
        const {params} = this.props;

        return (
            <div className="input-group" style={{marginTop:5, marginBottom:5}}>

                <div className="input-group-prepend">
                    <span className="input-group-text" style={{width: "2.8rem"}}>{params['text']}</span>
                </div>
                <input id={params['id']} type="date" className="form-control date"/>

            </div>
        )

    }
}

export default DateBox