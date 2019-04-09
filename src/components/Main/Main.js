import React, {Component} from 'react'
import Content from './Content/Content.js'
import LeftSideBar from './LeftSideBar/LeftSideBar.js'
import InputSearch from './InputSearch.js'


class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fields: null,
            params: null,
            update: false
        };
        this.onParamsChange = this.onParamsChange.bind(this);
        this.onUpdateChange = this.onUpdateChange.bind(this);

    }

    onParamsChange(params) {
        const old_params = this.state.params;
        let change_params = true;
        if (old_params != null) {
            change_params = false;
            for (let key in old_params) {
                if (old_params.hasOwnProperty(key) && params.hasOwnProperty(key)) {
                    if (old_params[key] !== params[key]) {
                        change_params = true;
                    }
                }
            }
        }
        if (change_params)
            this.setState({
                params: params,
            });
    }

    onUpdateChange(update) {
        if (this.state.update !== update) {
            this.setState(state => ({update: update}));
            // console.log("Main:", update);
        }
    }

    loadFields() {
        let self = this;

        const HHRU = "https://api.hh.ru";
        const arr = ["areas", "industries", "specializations", "dictionaries"];
        const n = arr.length;

        let data = {};

        let i = 0;
        setTimeout(function f(n, i) {
            if (i < n) {

                let x = new XMLHttpRequest();
                x.open("GET", HHRU + "/" + arr[i], true);
                x.onload = function () {
                    data[arr[i]] = JSON.parse(x.response);
                    i++;
                    setTimeout(f, 60, n, i);

                };
                x.send(null);
            }
            else {
                self.setState({fields: data});
            }
        }, 60, n, i);
    }

    componentDidMount() {
        this.loadFields();
    }


    render() {
        return (
            <div className="row">
                <InputSearch update={this.state.update} onParamsChange={this.onParamsChange}
                             onUpdateChange={this.onUpdateChange}/>

                <div className="col-xs-4 col-md-3">
                    {this.state.fields ? <LeftSideBar fields={this.state.fields}/> : <div>Загрузка...</div>}

                </div>
                <div className="col-xs-14 col-md-9">
                    <Content fields={this.state.fields} params={this.state.params} update={this.state.update}
                             onUpdateChange={this.onUpdateChange}>

                    </Content>
                </div>

            </div>

        )
    }
}

export default Main
