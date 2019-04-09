import React, {Component} from 'react'

class Select extends Component {

    render() {
        const {params} = this.props;
        // console.log(params);
        let array = params['array'];

        const options = array.map(item =>
            <option key={item['id']} value={item['id']}>{item['name']}</option>);

        const to_render = <select onChange={params['func']? params['func']: function () {}} className="custom-select d-block w-100" id={params.id} required>
            <option value="-1">{params['name']}</option>
            {options}
        </select>;

        return (
            <div style={{marginTop:5, marginBottom:5}}>
                {to_render}

            </div>
        )

    }
}

export default Select